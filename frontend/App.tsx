import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircleArrowDown, CircleArrowOutUpRight, Minus, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "./components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const App = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I use this in my project?",
      answer: "Yes. Free to use for personal and commercial projects. No attribution required.",
    },
    {
      question: "Is there any support available?",
      answer: "Yes, support is available via our documentation and community forums.",
    },
    {
      question: "How do I report a bug?",
      answer: "You can report bugs through our GitHub issue tracker.",
    },
    // Add more FAQs as needed
  ];

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white px-20">
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
            <div className="w-full md:w-1/2 mb-8 md:mb-0 space-y-10 flex-col">
              <div>
                <p className="text-green text-xs">TRY IT NOW !</p>
                <h2 className="text-7xl font-semibold mb-4 text-navy">
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

                  <p className="text-green text-xs">Trusted by 800+ individuals</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="https://utfs.io/f/PKy8oE1GN2J3A6pNlecTLpFHQKPUGyM3O2Id90ntzxhmiAsV"
                alt="Digital Asset Security"
                className="rounded-lg shadow-lg w-full md:w-5/6 ml-auto"
              />
            </div>
          </div>
        </section>

        {/* Partners and companies */}
        <section>
          <div className="space-y-3">
            <Separator />
            <div className="flex justify-evenly items-center">
              <p className="ml-2 flex items-center text-green font-semibold">
                {" "}
                <img src="/p1.svg" className="w-12 h-12" /> Eternity
              </p>

              <p className="ml-2 flex items-center text-green font-semibold">
                {" "}
                <img src="/p3.svg" className="w-16 h-16" />
              </p>
              <p className="ml-2 flex items-center text-green font-semibold">
                {" "}
                <img src="/p4.svg" className="w-9 h-9" /> Gnosis
              </p>
              <p className="ml-2 flex items-center text-green font-semibold">
                {" "}
                <img src="/p5.svg" className="w-8 h-8" /> Celo
              </p>
              <p className="ml-2 flex items-center text-green font-semibold">
                {" "}
                <img src="/p2.svg" className="w-14 h-14" />
              </p>
            </div>
            <Separator />
          </div>
        </section>

        {/* Features us */}
        <section className="p-10 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-green text-xs">VALUES!</p>
              <h2 className="text-2xl font-semibold text-navy">
                Keep your assets
                <br />
                <span className="">Well-secured</span>
              </h2>
            </div>

            <p className="text-green text-xs line-clamp-2 max-w-96">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus nemo aut explicabo omnis quisquam
              veritatis provident, sed facilis dolor laudantium quas sunt. At soluta quasi mollitia provident doloremque
              sunt autem alias voluptas commodi iste debitis animi tempore eveniet unde quibusdam magnam odit enim
              repellendus saepe magni nisi, harum dolorem dignissimos.
            </p>
          </div>

          <div className="flex space-x-3 items-center">
            <Card className="bg-transparent rounded-none border border-gray-500 py-6">
              <CardContent className="flex flex-col gap-6">
                <CircleArrowDown />

                <div className="space-y-2">
                  <p className="font-semibold text-navy">Transparency</p>
                  <p className="text-sm text-green">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit eos voluptatibus unde cum hic
                    nesciunt?
                  </p>
                </div>

                <CircleArrowOutUpRight />
              </CardContent>
            </Card>
            <Card className="bg-transparent rounded-none border border-gray-500 py-6">
              <CardContent className="flex flex-col gap-6">
                <CircleArrowDown />

                <div className="space-y-2">
                  <p className="font-semibold text-navy">Transparency</p>
                  <p className="text-sm text-green">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit eos voluptatibus unde cum hic
                    nesciunt?
                  </p>
                </div>

                <CircleArrowOutUpRight />
              </CardContent>
            </Card>
            <Card className="bg-carton rounded-none rounded-tr-[80px] border border-gray-500 py-6">
              <CardContent className="flex flex-col gap-6">
                <CircleArrowDown />

                <div className="space-y-2">
                  <p className="font-semibold text-navy">Transparency</p>
                  <p className="text-sm text-green">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit eos voluptatibus unde cum hic
                    nesciunt?
                  </p>
                </div>

                <CircleArrowOutUpRight className="bg-green p-1 rounded-full" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        {/* <section id="features" className="py-20">
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
        </section> */}

        {/* Stats section */}
        <section id="stats" className="bg-green text-white p-10">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-center">$500M </p>
              <p className="text-base">Total assets and funds locked </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-center">23k + </p>
              <p className="text-base">Disbursed per day </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-center">12+ </p>
              <p className="text-base">Ecosystem partners </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="faq" className="p-10 flex justify-between space-x-10">
          <div className="flex-shrink-0">
            <p className="text-sm text-green">FAQ</p>
            <p className="text-2xl text-navy font-semibold">Frequently asked questions</p>
          </div>

          <div className="w-1/2">
            {" "}
            {/* Set a fixed width or use a fraction */}
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <Collapsible open={openIndex === index} onOpenChange={() => toggleFAQ(index)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <span className="text-sm text-navy">{faq.question}</span>
                    {openIndex === index ? <Minus className="ml-2 w-4 h-4" /> : <Plus className="ml-2 w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="text-xs mt-3">{faq.answer}</p>
                  </CollapsibleContent>
                </Collapsible>
                <div className="border-b border-gray-300 my-5"></div> {/* Separator */}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}

      <footer className=" text-navy py-8">
        <div className="container mx-auto px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-green">AssetGuard</h3>
              <p className="text-sm">Securing your digital future</p>
            </div>
            <nav className="mb-4 sm:mb-0 text-sm">
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
          <div className="mt-4 text-center text-sm">
            <p>&copy; 2024 AssetGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
