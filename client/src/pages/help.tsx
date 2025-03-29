import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Help() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this to an API
    toast({
      title: t("help.message_sent"),
      description: t("help.message_sent_description"),
    });
    
    // Reset the form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  
  // FAQs data
  const faqs = [
    {
      question: t("help.faq.question1"),
      answer: t("help.faq.answer1")
    },
    {
      question: t("help.faq.question2"),
      answer: t("help.faq.answer2")
    },
    {
      question: t("help.faq.question3"),
      answer: t("help.faq.answer3")
    },
    {
      question: t("help.faq.question4"),
      answer: t("help.faq.answer4")
    },
    {
      question: t("help.faq.question5"),
      answer: t("help.faq.answer5")
    }
  ];
  
  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => 
    searchQuery === "" || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{t("help.title")}</h2>
        <p className="text-gray-600 mt-1">{t("help.subtitle")}</p>
      </div>
      
      {/* Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full mx-auto bg-primary-100 flex items-center justify-center mb-4">
              <span className="material-icons text-primary-600">contact_support</span>
            </div>
            <h3 className="font-medium mb-2">{t("help.support_center")}</h3>
            <p className="text-gray-600 text-sm mb-3">{t("help.support_center_description")}</p>
            <div className="flex items-center justify-center">
              <span className="material-icons text-primary-600 text-sm mr-1">phone</span>
              <span className="text-primary-600 text-sm">1500123</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full mx-auto bg-primary-100 flex items-center justify-center mb-4">
              <span className="material-icons text-primary-600">question_answer</span>
            </div>
            <h3 className="font-medium mb-2">{t("help.live_chat")}</h3>
            <p className="text-gray-600 text-sm mb-3">{t("help.live_chat_description")}</p>
            <Button variant="outline" className="text-primary-600 border-primary-600">
              {t("help.start_chat")}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full mx-auto bg-primary-100 flex items-center justify-center mb-4">
              <span className="material-icons text-primary-600">location_on</span>
            </div>
            <h3 className="font-medium mb-2">{t("help.service_centers")}</h3>
            <p className="text-gray-600 text-sm mb-3">{t("help.service_centers_description")}</p>
            <Button variant="outline" className="text-primary-600 border-primary-600">
              {t("help.find_closest")}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("help.faq.title")}</CardTitle>
              <CardDescription>{t("help.faq.subtitle")}</CardDescription>
              <div className="mt-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <span className="material-icons text-lg">search</span>
                  </span>
                  <Input
                    type="text"
                    placeholder={t("help.faq.search_placeholder")}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6">
                  <span className="material-icons text-gray-400 text-4xl mb-2">search_off</span>
                  <p className="text-gray-500">{t("help.faq.no_results")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("help.contact_us.title")}</CardTitle>
              <CardDescription>{t("help.contact_us.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("help.contact_us.name")}</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">{t("help.contact_us.email")}</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">{t("help.contact_us.subject")}</Label>
                  <Input 
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">{t("help.contact_us.message")}</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    rows={4}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">{t("help.contact_us.send")}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Component for form labels
function Label({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}
