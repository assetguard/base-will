/**
 * This provides an example for sending locked coins to recipients to be unlocked after a specific time.
 *
 * Locked coins flow:
 * 1. Deploy the lockup contract. Deployer can decide if the contract is upgradable or not.
 * 2. Sponsor accounts (sponsors) call initialize_sponsor with the appropriate CoinType to set up their account for
 * creating locks later.
 * 2. Sponsors add locked APTs for custom expiration time + amount for recipients. Each lockup is called a "lock".
 * 3. Sponsors can revoke a lock or change lockup (reduce or extend) anytime. This gives flexibility in case of
 * contract violation or special circumstances. If this is not desired, the deployer can remove these functionalities
 * before deploying. If a lock is canceled, the locked coins will be sent back to the withdrawal address. This
 * withdrawal address is set when initilizing the sponsor account and can only be changed when there are no active or
 * unclaimed locks.
 * 4. Once the lockup has expired, the recipient can call claim to get the unlocked tokens.
 **/
module message_board_addr::locked_coins {
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use std::error;
    use std::signer;
    use std::vector;

    /// Represents a lock of coins until some specified unlock time. Afterward, the recipient can claim the coins.
    struct Lock<phantom CoinType> has store {
        coins: Coin<CoinType>,
        unlock_time_secs: u64,
    }

    /// Structure to hold recipient's lock information
    struct RecipientLockInfo has drop, store {
        amount: u64,
        unlock_time_secs: u64,
        is_locked: bool,
    }

    /// Holder for a map from recipients => locks.
    /// There can be at most one lock per recipient.
    struct Locks<phantom CoinType> has key {
        locks: Table<address, Lock<CoinType>>,
        withdrawal_address: address,
        total_locks: u64,
        recipients: vector<address>,  // Add this line
    }

    #[event]
    /// Event emitted when a lock is canceled.
    struct CancelLockup has drop, store {
        sponsor: address,
        recipient: address,
        amount: u64,
    }

    #[event]
    /// Event emitted when a recipient claims unlocked coins.
    struct Claim has drop, store {
        sponsor: address,
        recipient: address,
        amount: u64,
        claimed_time_secs: u64,
    }

    #[event]
    /// Event emitted when lockup is updated for an existing lock.
    struct UpdateLockup has drop, store {
        sponsor: address,
        recipient: address,
        old_unlock_time_secs: u64,
        new_unlock_time_secs: u64,
    }

    #[event]
    /// Event emitted when withdrawal address is updated.
    struct UpdateWithdrawalAddress has drop, store {
        sponsor: address,
        old_withdrawal_address: address,
        new_withdrawal_address: address,
    }

    /// Structure to hold lock information
    struct LockInfo has drop, store {
        recipient: address,
        amount: u64,
        unlock_time_secs: u64,
    }

    /// No locked coins found to claim.
    const ELOCK_NOT_FOUND: u64 = 1;
    /// Lockup has not expired yet.
    const ELOCKUP_HAS_NOT_EXPIRED: u64 = 2;
    /// Can only create one active lock per recipient at once.
    const ELOCK_ALREADY_EXISTS: u64 = 3;
    /// The length of the recipients list doesn't match the amounts.
    const EINVALID_RECIPIENTS_LIST_LENGTH: u64 = 3;
    /// Sponsor account has not been set up to create locks for the specified CoinType yet.
    const ESPONSOR_ACCOUNT_NOT_INITIALIZED: u64 = 4;
    /// Cannot update the withdrawal address because there are still active/unclaimed locks.
    const EACTIVE_LOCKS_EXIST: u64 = 5;

   #[view]
    /// Return the total number of locks created by the sponsor for the given CoinType.
    public fun total_locks<CoinType>(sponsor: address): u64 acquires Locks {
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global<Locks<CoinType>>(sponsor);
        locks.total_locks
    }

    #[view]
    /// Return the number of coins a sponsor has locked up for the given recipient.
    /// This throws an error if there are no locked coins setup for the given recipient.
    public fun locked_amount<CoinType>(sponsor: address, recipient: address): u64 acquires Locks {
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global<Locks<CoinType>>(sponsor);
        assert!(table::contains(&locks.locks, recipient), error::not_found(ELOCK_NOT_FOUND));
        coin::value(&table::borrow(&locks.locks, recipient).coins)
    }

    #[view]
    /// Return the timestamp (in seconds) when the given recipient can claim coins locked up for them by the sponsor.
    /// This throws an error if there are no locked coins setup for the given recipient.
    public fun claim_time_secs<CoinType>(sponsor: address, recipient: address): u64 acquires Locks {
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global<Locks<CoinType>>(sponsor);
        assert!(table::contains(&locks.locks, recipient), error::not_found(ELOCK_NOT_FOUND));
        table::borrow(&locks.locks, recipient).unlock_time_secs
    }

    #[view]
    /// Return the withdrawal address for a sponsor's locks (where canceled locks' funds are sent to).
    public fun withdrawal_address<CoinType>(sponsor: address): address acquires Locks {
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global<Locks<CoinType>>(sponsor);
        locks.withdrawal_address
    }
    
    /// Function for sponsors to get all recipients and amounts locked for them
    #[view]
    public fun get_sponsor_locks<CoinType>(sponsor: address): vector<LockInfo> acquires Locks {
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        
        let locks = borrow_global<Locks<CoinType>>(sponsor);
        let result = vector::empty<LockInfo>();
        
        let i = 0;
        let len = vector::length(&locks.recipients);
        
        while (i < len) {
            let recipient = *vector::borrow(&locks.recipients, i);
            let lock = table::borrow(&locks.locks, recipient);
            let lock_info = LockInfo {
                recipient,
                amount: coin::value(&lock.coins),
                unlock_time_secs: lock.unlock_time_secs,
            };
            vector::push_back(&mut result, lock_info);
            i = i + 1;
        };
        
        result
    }


    /// Update the withdrawal address. This is only allowed if there are currently no active locks.
    public entry fun update_withdrawal_address<CoinType>(
        sponsor: &signer, new_withdrawal_address: address) acquires Locks {
        let sponsor_address = signer::address_of(sponsor);
        assert!(exists<Locks<CoinType>>(sponsor_address), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));

        let locks = borrow_global_mut<Locks<CoinType>>(sponsor_address);
        assert!(locks.total_locks == 0, error::invalid_state(EACTIVE_LOCKS_EXIST));
        let old_withdrawal_address = locks.withdrawal_address;
        locks.withdrawal_address = new_withdrawal_address;

        event::emit(UpdateWithdrawalAddress {
            sponsor: sponsor_address,
            old_withdrawal_address,
            new_withdrawal_address,
        });
    }


    /// `Sponsor` can add locked coins for `recipient` with given unlock timestamp (in seconds).
    /// There's no restriction on unlock timestamp so sponsors could technically add coins for an unlocked time in the
    /// past, which means the coins are immediately unlocked.
    /// Initialize the sponsor account and add the first locked coins in one operation.
    public entry fun init_and_add_locked_coins<CoinType>(
        sponsor: &signer,
        recipient: address,
        amount: u64,
        unlock_time_secs: u64
    ) acquires Locks {
        let sponsor_address = signer::address_of(sponsor);
        
        if (!exists<Locks<CoinType>>(sponsor_address)) {
            move_to(sponsor, Locks {
                locks: table::new<address, Lock<CoinType>>(),
                withdrawal_address: sponsor_address,
                total_locks: 0,
                recipients: vector::empty<address>(), // Initialize empty vector
            });
        };

        let locks = borrow_global_mut<Locks<CoinType>>(sponsor_address);
        let coins = coin::withdraw<CoinType>(sponsor, amount);
        assert!(!table::contains(&locks.locks, recipient), error::already_exists(ELOCK_ALREADY_EXISTS));
        table::add(&mut locks.locks, recipient, Lock<CoinType> { coins, unlock_time_secs });
        vector::push_back(&mut locks.recipients, recipient); // Add recipient to the list
        locks.total_locks = locks.total_locks + 1;
    }

    #[view]
    /// Return the lock details for a specific recipient from a specific sponsor
    /// Returns a RecipientLockInfo struct containing:
    /// - amount: the amount of coins locked
    /// - unlock_time_secs: when the coins can be claimed
    /// - is_locked: whether the current time is before unlock_time_secs
    public fun get_recipient_lock_info<CoinType>(
        sponsor: address,
        recipient: address
    ): RecipientLockInfo acquires Locks {
        // Check if the sponsor has initialized their locks
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        
        let locks = borrow_global<Locks<CoinType>>(sponsor);
        
        // Check if there's a lock for this recipient
        assert!(table::contains(&locks.locks, recipient), error::not_found(ELOCK_NOT_FOUND));
        
        let lock = table::borrow(&locks.locks, recipient);
        let current_time = timestamp::now_seconds();
        
        RecipientLockInfo {
            amount: coin::value(&lock.coins),
            unlock_time_secs: lock.unlock_time_secs,
            is_locked: current_time < lock.unlock_time_secs,
        }
    }

    /// Recipient can claim coins that are fully unlocked (unlock time has passed).
    /// To claim, `recipient` would need the sponsor's address. In the case where each sponsor always deploys this
    /// module anew, it'd just be the module's hosted account address.
    public entry fun claim<CoinType>(recipient: &signer, sponsor: address) acquires Locks {
        assert!(exists<Locks<CoinType>>(sponsor), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global_mut<Locks<CoinType>>(sponsor);
        let recipient_address = signer::address_of(recipient);
        assert!(table::contains(&locks.locks, recipient_address), error::not_found(ELOCK_NOT_FOUND));

        // Delete the lock entry both to keep records clean and keep storage usage minimal.
        // This would be reverted if validations fail later (transaction atomicity).
        let Lock { coins, unlock_time_secs } = table::remove(&mut locks.locks, recipient_address);
        locks.total_locks = locks.total_locks - 1;
        let now_secs = timestamp::now_seconds();
        assert!(now_secs >= unlock_time_secs, error::invalid_state(ELOCKUP_HAS_NOT_EXPIRED));

        let amount = coin::value(&coins);
        // This would fail if the recipient account is not registered to receive CoinType.
        coin::deposit(recipient_address, coins);

        event::emit(Claim {
            sponsor,
            recipient: recipient_address,
            amount,
            claimed_time_secs: now_secs,
        });
    }

    /// Sponsor can update the lockup of an existing lock.
    public entry fun update_lockup<CoinType>(
        sponsor: &signer, recipient: address, new_unlock_time_secs: u64) acquires Locks {
        let sponsor_address = signer::address_of(sponsor);
        assert!(exists<Locks<CoinType>>(sponsor_address), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global_mut<Locks<CoinType>>(sponsor_address);
        assert!(table::contains(&locks.locks, recipient), error::not_found(ELOCK_NOT_FOUND));

        let lock = table::borrow_mut(&mut locks.locks, recipient);
        let old_unlock_time_secs = lock.unlock_time_secs;
        lock.unlock_time_secs = new_unlock_time_secs;

        event::emit(UpdateLockup {
            sponsor: sponsor_address,
            recipient,
            old_unlock_time_secs,
            new_unlock_time_secs,
        });
    }

    /// Sponsor can cancel an existing lock.
    public entry fun cancel_lockup<CoinType>(sponsor: &signer, recipient: address) acquires Locks {
        let sponsor_address = signer::address_of(sponsor);
        assert!(exists<Locks<CoinType>>(sponsor_address), error::not_found(ESPONSOR_ACCOUNT_NOT_INITIALIZED));
        let locks = borrow_global_mut<Locks<CoinType>>(sponsor_address);
        assert!(table::contains(&locks.locks, recipient), error::not_found(ELOCK_NOT_FOUND));

        let Lock { coins, unlock_time_secs: _ } = table::remove(&mut locks.locks, recipient);
        
        // Remove recipient from the recipients list
        let (exists, index) = vector::index_of(&locks.recipients, &recipient);
        if (exists) {
            vector::remove(&mut locks.recipients, index);
        };
        
        locks.total_locks = locks.total_locks - 1;
        let amount = coin::value(&coins);
        coin::deposit(locks.withdrawal_address, coins);

        event::emit(
            CancelLockup {
                sponsor: sponsor_address,
                recipient,
                amount
            });
    }

    
}