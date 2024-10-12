import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { LucideCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="">
        <div className="container mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-12">
            <h1 className="text-xl font-semibold text-green sm:mb-0">AssetGuard</h1>

            <nav className="sm:mb-0 text-navy text-sm">
              <ul className="flex space-x-8">
                <li>
                  <a href="#features" className=" hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className=" hover:text-blue-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className=" hover:text-blue-600">
                    Testimonials
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex space-x-3">
            <Button
              className="bg-white hover:bg-white text-green rounded-full text-sm px-2"
              onClick={() => navigate("/home")}
            >
              Login
            </Button>
            <Button className="bg-green hover:bg-green rounded-full text-sm px-4" onClick={() => navigate("/home")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section with Gradient */}
        <section className="py-16">
          <div className="container mx-auto px-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 space-y-8 flex-col">
              <div>
                <p className="text-green text-xs">TRY IT NOW!</p>
                <h2 className="text-4xl font-semibold mb-4 text-navy">
                  Secure Your <br />
                  <span className="">Digital Legacy</span>
                </h2>
              </div>

              <p className="text-xs mb-8 pr-8 text-green">
                Set up a beneficiary system for your digital assets. Ensure your funds are recovered and distributed
                according to your wishes.
              </p>

              <div className="flex space-x-5 items-center">
                <Button
                  onClick={() => navigate("/home")}
                  className="bg-green hover:bg-green rounded-full px-6"
                  size="lg"
                >
                  Get Started Now
                </Button>

                <div className="space-y-1">
                  <div className="flex space-x-1 items-center">
                    <Star className="text-yellow-400 h-4 w-4" />
                    <Star className="text-yellow-400 h-4 w-4" />
                    <Star className="text-yellow-400 h-4 w-4" />
                    <Star className="text-yellow-400 h-4 w-4" />
                    <Star className="text-yellow-400 h-4 w-4" />
                    <p className="text-green font-semibold text-sm">5.0</p>
                  </div>

                  <p className="text-green text-xs">Trusted by 200+ individuals</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="https://res.cloudinary.com/dgbreoalg/image/upload/v1728636643/happy-men-bachelor-party_gngtcl.png"
                alt="Digital Asset Security"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12">KEY FEATURES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Timed Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full mb-4">
                    <img
                      src="https://res.cloudinary.com/dgbreoalg/image/upload/v1728641052/sand-sand-desert-with-sand-timer_250469-23208_imcxum.avif"
                      className="rounded-sm w-full h-full object-cover"
                      alt="wisdom"
                    />
                  </div>
                  <p>Set specific dates for asset distribution to your beneficiaries.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Asset Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full mb-4">
                    <img
                      src="https://res.cloudinary.com/dgbreoalg/image/upload/v1728641739/photo-1563986768711-b3bde3dc821e_uxpxw6.jpg"
                      alt="growth"
                      className="rounded-sm w-full h-full object-cover"
                    />
                  </div>
                  <p>Manage various digital assets including cryptocurrencies and tokens.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secure Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full mb-4">
                    <img
                      src="https://res.cloudinary.com/dgbreoalg/image/upload/v1728641475/security-lock-laptop-and-on-cyber-plate-a-3d-rendered-internet-protection-concept_9630738_oomj9m.jpg"
                      className="rounded-sm w-full h-full object-cover"
                      alt="unlock"
                    />
                  </div>
                  <p>Your asset information is protected with state-of-the-art encryption.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-slate-600 border border-gray-600 text-white py-20">
          <div className="container mx-auto px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-12">HOW IT WORKS</h2>
            <div className="flex flex-col md:flex-row items-center px-8">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <ul className=" space-y-8 text-lg">
                  <li className="flex items-center gap-2">
                    <span className="p-2 rounded-full border-[#6EE7B7] border-2 ">
                      <LucideCheck />
                    </span>
                    <p>Sign up and verify your identity</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="p-2 rounded-full border-[#6EE7B7] border-2 ">
                      <LucideCheck />
                    </span>

                    <p>Add your digital assets to the system</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="p-2 rounded-full border-[#6EE7B7] border-2">
                      <LucideCheck />
                    </span>
                    <p>Set up beneficiaries and distribution rules</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="p-2 rounded-full border-[#6EE7B7] border-2">
                      <LucideCheck />
                    </span>
                    <p>Specify trigger conditions or dates</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="p-2 rounded-full border-[#6EE7B7] border-2">
                      <LucideCheck />
                    </span>
                    <p>Rest easy knowing your digital legacy is secure</p>
                  </li>
                </ul>
              </div>
              <div className="w-full flex items-center justify-center md:w-1/2">
                <img
                  src="https://res.cloudinary.com/dgbreoalg/image/upload/v1728554048/ella_ckh7pt.jpg"
                  alt="dd"
                  className="rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto lg:px-24">
            <h2 className="text-3xl font-bold text-center mb-12">WHAT OUR USERS SAY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className=" items-start">
                <CardHeader className="flex flex-row items-center gap-1">
                  <Avatar>
                    <AvatarImage src="https://xsgames.co/randomusers/avatar.php?g=male" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>John D.</CardTitle>
                    <CardDescription>Crypto Investor</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    "AssetGuard gives me peace of mind knowing my digital assets are secure and will be distributed
                    according to my wishes."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-1">
                  <Avatar>
                    <AvatarImage src="https://xsgames.co/randomusers/assets/avatars/female/48.jpg" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Sarah M.</CardTitle>
                    <CardDescription>Tech Investor</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    "The user-friendly interface and robust security features make AssetGuard the perfect solution for
                    managing my digital legacy."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-1">
                  <Avatar>
                    <AvatarImage src="https://xsgames.co/randomusers/assets/avatars/male/27.jpg" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Moses A.</CardTitle>
                    <CardDescription>Tech Entrepreneur</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    "The user-friendly interface and robust security features make AssetGuard the perfect solution for
                    managing my digital legacy."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl font-bold">AssetGuard</h3>
              <p>Securing your digital future</p>
            </div>
            <nav className="mb-4 sm:mb-0">
              <ul className="flex flex-wrap justify-center sm:justify-end space-x-4">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mt-4 text-center">
            <p>&copy; 2024 AssetGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
