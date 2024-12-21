export const projectsDummyData = [
    {
      _id: "1",
      projectName: "Website Redesign",
      projectDescription: "Complete overhaul of company website with modern design and improved functionality",
      budget: 40000, // Combined budget for all modules
      isActive: true,
      approvalStatus: "PENDING",
      sendForApproval: true,
      approvedByFinance: false,
      modules: [
        {
          moduleName: "Frontend Development",
          description: "Implement new user interface components and responsive design",
          isActive: true,
          deadline: new Date("2025-03-15")
        },
        {
          moduleName: "Backend Integration",
          description: "API development and database optimization",
          isActive: true,
          deadline: new Date("2025-04-01")
        },
        {
          moduleName: "Content Migration",
          description: "Transfer and update all existing content to new platform",
          isActive: true,
          deadline: new Date("2025-03-20")
        },
        {
            moduleName: "SEO Optimization",
            description: "Improve search engine visibility and ranking",
            isActive: true,
            deadline: new Date("2025-04-15")
        }
      ]
    },
    {
      _id: "2",
      projectName: "Mobile App Development",
      projectDescription: "Develop a new mobile application for customer engagement",
      budget: 25000, // Combined budget for all modules
      isActive: true,
      approvalStatus: "APPROVED",
      sendForApproval: true,
      approvedByFinance: true,
      modules: [
        {
          moduleName: "User Authentication",
          description: "Implement secure login and user management system",
          isActive: true,
          deadline: new Date("2025-02-28")
        },
        {
          moduleName: "Payment Gateway",
          description: "Integration of payment processing system",
          isActive: true,
          deadline: new Date("2025-03-15")
        }
      ]
    },
    {
      _id: "3",
      projectName: "Data Analytics Platform",
      projectDescription: "Build an internal analytics dashboard for business metrics",
      budget: 75000, // Combined budget for all modules
      isActive: false,
      approvalStatus: "REJECTED",
      sendForApproval: true,
      approvedByFinance: false,
      modules: [
        {
          moduleName: "Data Collection",
          description: "Set up data collection and storage infrastructure",
          isActive: false,
          deadline: new Date("2025-05-01")
        },
        {
          moduleName: "Visualization Tools",
          description: "Implement interactive charts and reporting features",
          isActive: false,
          deadline: new Date("2025-05-15")
        },
        {
          moduleName: "Machine Learning Integration",
          description: "Develop predictive analytics features",
          isActive: false,
          deadline: new Date("2025-06-01")
        }
      ]
    },
    {
      _id: "4",
      projectName: "CRM System Implementation",
      projectDescription: "Implementation of new customer relationship management system",
      budget: 50000,
      isActive: true,
      approvalStatus: "PENDING",
      sendForApproval: false,
      approvedByFinance: false,
      modules: [
        {
          moduleName: "Customer Database Setup",
          description: "Setting up and configuring customer database architecture",
          isActive: true,
          deadline: new Date("2025-04-15")
        },
        {
          moduleName: "Sales Pipeline Integration",
          description: "Implementing sales tracking and pipeline management",
          isActive: true,
          deadline: new Date("2025-05-01")
        },
        {
          moduleName: "Reporting Dashboard",
          description: "Creating customized reporting and analytics dashboard",
          isActive: true,
          deadline: new Date("2025-05-15")
        }
      ]
    }
  ];