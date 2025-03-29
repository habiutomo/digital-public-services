import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  serviceCategories, type ServiceCategory, type InsertServiceCategory,
  applications, type Application, type InsertApplication,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByNIK(nik: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getFeaturedServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Service category operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Application operations
  getApplications(userId: number): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByNumber(applicationNumber: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application>;
  
  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  // Store collections
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private serviceCategories: Map<number, ServiceCategory>;
  private applications: Map<number, Application>;
  private notifications: Map<number, Notification>;
  
  // ID counters
  private userIdCounter: number;
  private serviceIdCounter: number;
  private serviceCategoryIdCounter: number;
  private applicationIdCounter: number;
  private notificationIdCounter: number;
  
  constructor() {
    // Initialize collections
    this.users = new Map();
    this.services = new Map();
    this.serviceCategories = new Map();
    this.applications = new Map();
    this.notifications = new Map();
    
    // Initialize counters
    this.userIdCounter = 1;
    this.serviceIdCounter = 1;
    this.serviceCategoryIdCounter = 1;
    this.applicationIdCounter = 1;
    this.notificationIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByNIK(nik: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.nik === nik
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.category === category
    );
  }
  
  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.featured
    );
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  // Service category operations
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }
  
  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }
  
  async createServiceCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.serviceCategoryIdCounter++;
    const category: ServiceCategory = { ...insertCategory, id };
    this.serviceCategories.set(id, category);
    return category;
  }
  
  // Application operations
  async getApplications(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.userId === userId
    );
  }
  
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async getApplicationByNumber(applicationNumber: string): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      (application) => application.applicationNumber === applicationNumber
    );
  }
  
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationIdCounter++;
    const applicationNumber = `P-${new Date().getFullYear().toString().substring(2)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`;
    
    const application: Application = { 
      ...insertApplication, 
      id, 
      applicationNumber,
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    
    this.applications.set(id, application);
    return application;
  }
  
  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const application = await this.getApplication(id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    const updatedApplication = { 
      ...application, 
      status,
      updatedAt: new Date()
    };
    
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // Notification operations
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId && !notification.isRead
    ).length;
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const notification: Notification = { 
      ...insertNotification, 
      id,
      isRead: false,
      createdAt: new Date()
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId && !notification.isRead) {
        this.notifications.set(id, { ...notification, isRead: true });
      }
    }
  }
  
  // Sample data initialization
  private initializeSampleData() {
    // Add a default user
    this.createUser({
      username: "budisantoso",
      password: "password123",
      nik: "1234567890123456",
      fullName: "Budi Santoso",
      birthPlace: "Jakarta",
      birthDate: "1990-01-01",
      gender: "L",
      religion: "islam",
      maritalStatus: "kawin",
      address: "Jl. Merdeka No. 17, Jakarta",
      phone: "081234567890",
      email: "budi.santoso@email.com",
      language: "id"
    });
    
    // Add service categories
    const categories = [
      { name: "Kependudukan", icon: "person" },
      { name: "Kesehatan", icon: "local_hospital" },
      { name: "Pendidikan", icon: "school" },
      { name: "Perizinan", icon: "business" }
    ];
    
    categories.forEach(category => {
      this.createServiceCategory(category);
    });
    
    // Add services
    const servicesList = [
      { 
        name: "e-KTP", 
        description: "Pengajuan dan perpanjangan kartu tanda penduduk elektronik", 
        category: "Kependudukan", 
        icon: "assignment_ind", 
        featured: true,
        popular: true
      },
      { 
        name: "Kartu Keluarga", 
        description: "Pengajuan dan perubahan kartu keluarga", 
        category: "Kependudukan", 
        icon: "family_restroom", 
        featured: false,
        popular: false
      },
      { 
        name: "BPJS Kesehatan", 
        description: "Pendaftaran, pembayaran, dan klaim asuransi kesehatan", 
        category: "Kesehatan", 
        icon: "healing", 
        featured: true,
        popular: false 
      },
      { 
        name: "Beasiswa", 
        description: "Pendaftaran beasiswa pendidikan", 
        category: "Pendidikan", 
        icon: "school", 
        featured: false,
        popular: false 
      },
      { 
        name: "Perizinan Usaha", 
        description: "Pengajuan izin usaha, SIUP, dan dokumen bisnis lainnya", 
        category: "Perizinan", 
        icon: "business_center", 
        featured: true,
        popular: false 
      },
      { 
        name: "Bantuan Sosial", 
        description: "Pengajuan bantuan sosial dan subsidi", 
        category: "Kependudukan", 
        icon: "attach_money", 
        featured: false,
        popular: false 
      },
      { 
        name: "Layanan Disabilitas", 
        description: "Layanan dan fasilitas untuk penyandang disabilitas", 
        category: "Kesehatan", 
        icon: "accessibility_new", 
        featured: false,
        popular: false 
      }
    ];
    
    servicesList.forEach(service => {
      this.createService(service);
    });
    
    // Add applications
    const applicationsList = [
      {
        userId: 1,
        serviceId: 1,
        status: "processing",
        formData: { nik: "1234567890123456", name: "Budi Santoso" }
      },
      {
        userId: 1,
        serviceId: 3,
        status: "completed",
        formData: { nik: "1234567890123456", name: "Budi Santoso" }
      },
      {
        userId: 1,
        serviceId: 5,
        status: "revision",
        formData: { nik: "1234567890123456", name: "Budi Santoso", businessName: "Toko Budi" }
      }
    ];
    
    applicationsList.forEach(application => {
      this.createApplication(application);
    });
    
    // Add notifications
    const notificationsList = [
      {
        userId: 1,
        title: "Permohonan e-KTP dalam proses",
        message: "Permohonan e-KTP Anda sedang diproses. Estimasi selesai dalam 5 hari kerja.",
        type: "info"
      },
      {
        userId: 1,
        title: "Pendaftaran BPJS selesai",
        message: "Pendaftaran BPJS Kesehatan Anda telah selesai. Kartu dapat diambil di kantor cabang terdekat.",
        type: "success"
      },
      {
        userId: 1,
        title: "Revisi dokumen diperlukan",
        message: "Mohon periksa kembali dokumen perizinan usaha Anda. Beberapa dokumen perlu diperbaiki.",
        type: "error"
      }
    ];
    
    notificationsList.forEach(notification => {
      this.createNotification(notification);
    });
  }
}

export const storage = new MemStorage();
