import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/app-context";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    description: string;
  } | null;
}

export function ServiceDetailModal({ open, onClose, service }: ServiceDetailModalProps) {
  const { t } = useTranslation();
  const { user } = useApp();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nik: user?.nik || "",
    fullName: user?.fullName || "",
    birthPlace: user?.birthPlace || "",
    birthDate: user?.birthDate || "",
    gender: user?.gender || "",
    religion: user?.religion || "",
    maritalStatus: user?.maritalStatus || "",
    address: user?.address || "",
    phone: user?.phone || "",
    email: user?.email || "",
    documentFile: null
  });
  
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!service) throw new Error("Service not found");
      
      const response = await apiRequest("POST", "/api/applications", {
        serviceId: service.id,
        formData
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("application.success_title"),
        description: t("application.success_message"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      onClose();
      // Reset form
      setFormData({
        nik: user?.nik || "",
        fullName: user?.fullName || "",
        birthPlace: user?.birthPlace || "",
        birthDate: user?.birthDate || "",
        gender: user?.gender || "",
        religion: user?.religion || "",
        maritalStatus: user?.maritalStatus || "",
        address: user?.address || "",
        phone: user?.phone || "",
        email: user?.email || "",
        documentFile: null
      });
      setStep(1);
    },
    onError: () => {
      toast({
        title: t("application.error_title"),
        description: t("application.error_message"),
        variant: "destructive"
      });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = () => {
    submitMutation.mutate();
  };
  
  if (!service) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{service.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">{t("service_modal.instructions", { serviceName: service.name })}</p>
          
          {/* Progress steps */}
          <div className="flex mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center`}>1</div>
              <div className={`text-xs mt-1 ${step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{t("service_modal.step1")}</div>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'} w-full`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center`}>2</div>
              <div className={`text-xs mt-1 ${step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{t("service_modal.step2")}</div>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'} w-full`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center`}>3</div>
              <div className={`text-xs mt-1 ${step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{t("service_modal.step3")}</div>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 ${step >= 4 ? 'bg-primary-600' : 'bg-gray-200'} w-full`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${step >= 4 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center`}>4</div>
              <div className={`text-xs mt-1 ${step >= 4 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{t("service_modal.step4")}</div>
            </div>
          </div>
          
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <Label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">{t("form.nik")}</Label>
                <Input
                  type="text"
                  id="nik"
                  name="nik"
                  placeholder={t("form.nik_placeholder")}
                  value={formData.nik}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">{t("form.nik_help")}</p>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">{t("form.full_name")}</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder={t("form.full_name_placeholder")}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">{t("form.birth_place")}</Label>
                  <Input
                    type="text"
                    id="birthPlace"
                    name="birthPlace"
                    placeholder={t("form.birth_place_placeholder")}
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">{t("form.birth_date")}</Label>
                  <Input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700 mb-1">{t("form.gender")}</Label>
                <RadioGroup 
                  defaultValue={formData.gender} 
                  onValueChange={(value) => handleRadioChange(value, "gender")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="L" id="gender-male" />
                    <Label htmlFor="gender-male">{t("form.gender_male")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="P" id="gender-female" />
                    <Label htmlFor="gender-female">{t("form.gender_female")}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1">{t("form.religion")}</Label>
                <Select 
                  defaultValue={formData.religion} 
                  onValueChange={(value) => handleSelectChange(value, "religion")}
                >
                  <SelectTrigger id="religion">
                    <SelectValue placeholder={t("form.religion_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="islam">{t("form.religion_islam")}</SelectItem>
                    <SelectItem value="kristen">{t("form.religion_christian")}</SelectItem>
                    <SelectItem value="katolik">{t("form.religion_catholic")}</SelectItem>
                    <SelectItem value="hindu">{t("form.religion_hindu")}</SelectItem>
                    <SelectItem value="buddha">{t("form.religion_buddhist")}</SelectItem>
                    <SelectItem value="konghucu">{t("form.religion_confucian")}</SelectItem>
                    <SelectItem value="lainnya">{t("form.religion_other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">{t("form.marital_status")}</Label>
                <Select 
                  defaultValue={formData.maritalStatus} 
                  onValueChange={(value) => handleSelectChange(value, "maritalStatus")}
                >
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder={t("form.marital_status_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="belum-kawin">{t("form.marital_status_single")}</SelectItem>
                    <SelectItem value="kawin">{t("form.marital_status_married")}</SelectItem>
                    <SelectItem value="cerai-hidup">{t("form.marital_status_divorced")}</SelectItem>
                    <SelectItem value="cerai-mati">{t("form.marital_status_widowed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Step 2: Address */}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">{t("form.address")}</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  placeholder={t("form.address_placeholder")}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t("form.phone")}</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder={t("form.phone_placeholder")}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("form.email_placeholder")}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Upload Documents */}
          {step === 3 && (
            <div>
              <div className="mb-4">
                <Label htmlFor="documentFile" className="block text-sm font-medium text-gray-700 mb-1">{t("form.upload_document")}</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>{t("form.upload_browse")}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">{t("form.upload_drag")}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t("form.upload_formats")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("form.confirmation_title")}</h3>
                <p className="text-sm text-gray-600 mb-4">{t("form.confirmation_description")}</p>
                
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/3 text-sm font-medium text-gray-500">{t("form.nik")}</span>
                    <span className="w-2/3 text-sm text-gray-900">{formData.nik}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm font-medium text-gray-500">{t("form.full_name")}</span>
                    <span className="w-2/3 text-sm text-gray-900">{formData.fullName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm font-medium text-gray-500">{t("form.birth_info")}</span>
                    <span className="w-2/3 text-sm text-gray-900">{formData.birthPlace}, {formData.birthDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm font-medium text-gray-500">{t("form.gender")}</span>
                    <span className="w-2/3 text-sm text-gray-900">
                      {formData.gender === "L" ? t("form.gender_male") : formData.gender === "P" ? t("form.gender_female") : ""}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm font-medium text-gray-500">{t("form.address")}</span>
                    <span className="w-2/3 text-sm text-gray-900">{formData.address}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm font-medium text-gray-500">{t("form.contact")}</span>
                    <span className="w-2/3 text-sm text-gray-900">{formData.phone}, {formData.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  {t("form.agree_terms")}
                </label>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline"
              onClick={prevStep}
              disabled={submitMutation.isPending}
            >
              {t("form.previous")}
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              disabled={submitMutation.isPending}
            >
              {t("form.cancel")}
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              type="button"
              onClick={nextStep}
              disabled={submitMutation.isPending}
            >
              {t("form.next")}
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? t("form.submitting") : t("form.submit")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
