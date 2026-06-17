import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const translations = {
  English: {
    // Sidebar
    administration: "Administration",
    commandCenter: "Command Center",
    citizens: "Citizens",
    spheres: "Spheres",
    main: "Main",
    home: "Home",
    messages: "Messages",
    assignments: "Assignments",
    calendar: "Calendar",
    settings: "Settings",
    myClasses: "My Classes",
    noClassesYet: "No classes yet",
    
    // TopNavbar
    joinClass: "Join Class",
    createClass: "Create Class",
    notifications: "Notifications",
    markAllAsRead: "Mark all as read",
    noNotificationsYet: "No notifications yet",
    viewAllActivity: "View All Activity",
    mySpheres: "My Spheres",
    noSpheresYet: "No spheres yet",
    joinNewSphere: "Join New Sphere",
    accountSettings: "Account Settings",
    signOut: "Sign Out",
    
    // SettingsPage
    configureSphere: "Configure your personal sphere experience",
    profile: "Profile",
    publicProfile: "Public Profile",
    profilePicture: "Profile Picture",
    pngJpgMax: "PNG or JPG, max 5MB",
    change: "Change",
    username: "Username",
    emailAddress: "Email Address",
    bio: "Bio",
    bioPlaceholder: "Tell us about your academic journey...",
    profileUpdated: "Profile updated",
    saveChanges: "Save Changes",
    notificationPreferences: "Notification Preferences",
    emailNotifications: "Email Notifications",
    receiveClassUpdates: "Receive class updates via email",
    pushNotifications: "Push Notifications",
    browserNotifications: "Browser notifications for events",
    dailyDigest: "Daily Digest",
    summaryDaily: "Summary of activity sent daily",
    security: "Security",
    appearance: "Appearance",
    language: "Language",
    securitySettings: "Security Settings",
    twoFactor: "Two-Factor Authentication",
    addExtraSecurity: "Add extra security to your account",
    sessionTimeout: "Session Timeout (minutes)",
    theme: "Theme",
    fontSize: "Font Size",
    languageSettings: "Language Settings",
    preferredLanguage: "Preferred Language",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    small: "Small",
    medium: "Medium",
    large: "Large",

    // OverviewPage
    classroomQuiet: "Your classroom is quiet.",
    classroomQuietDesc: "Create a class or join one using a code to get started. Use the + button in the top right.",
    
    // CalendarPage
    syncingSchedule: "Syncing your schedule...",
    assignmentsTracked: "assignments tracked",
    today: "Today",
    upcomingAgenda: "Upcoming Agenda",
    noDeadlines: "No upcoming deadlines found.",
    legend: "Legend",
    coreAcademics: "Core Academics",
    specialProjects: "Special Projects",
    deadlines: "Deadlines",
    
    // AssignmentsPage
    assignmentsHub: "Assignments Hub",
    manageWorkload: "Manage your academic workload and deadlines",
    pending: "Pending",
    completed: "Completed",
    tasks: "Tasks",
    currentAssignments: "Current Assignments",
    allStatus: "All Status",
    submitted: "Submitted",
    graded: "Graded",
    assignment: "Assignment",
    sphere: "Sphere",
    deadline: "Deadline",
    status: "Status",
    action: "Action",
    pointsAvailable: "Points Available",
    noAssignments: "No assignments found.",
    noDeadline: "No deadline",

    // MessagesPage
    chatsSearch: "Search chats...",
    noConversations: "No conversations yet",
    startedConversation: "Started a conversation",
    noMessagesYet: "No messages here yet",
    typeMessage: "Type your message...",
    communicationHub: "Your Communication Hub",
    communicationHubDesc: "Select a citizen to start a secure conversation or search for someone new.",
    startNewChat: "Start New Chat",
    findCitizen: "Find Citizen",
    typeUsername: "Type username...",
    noCitizensFound: "No citizens found",
  },
  Spanish: {
    // Sidebar
    administration: "Administración",
    commandCenter: "Centro de Mando",
    citizens: "Ciudadanos",
    spheres: "Esferas",
    main: "Principal",
    home: "Inicio",
    messages: "Mensajes",
    assignments: "Tareas",
    calendar: "Calendario",
    settings: "Configuración",
    myClasses: "Mis Clases",
    noClassesYet: "Aún no hay clases",
    
    // TopNavbar
    joinClass: "Unirse a la clase",
    createClass: "Crear clase",
    notifications: "Notificaciones",
    markAllAsRead: "Marcar todas como leídas",
    noNotificationsYet: "No hay notificaciones aún",
    viewAllActivity: "Ver toda la actividad",
    mySpheres: "Mis Esferas",
    noSpheresYet: "Sin esferas aún",
    joinNewSphere: "Unirse a nueva esfera",
    accountSettings: "Configuración de cuenta",
    signOut: "Cerrar sesión",
    
    // SettingsPage
    configureSphere: "Configura tu experiencia personal en la esfera",
    profile: "Perfil",
    publicProfile: "Perfil Público",
    profilePicture: "Foto de perfil",
    pngJpgMax: "PNG o JPG, máx 5MB",
    change: "Cambiar",
    username: "Nombre de usuario",
    emailAddress: "Correo electrónico",
    bio: "Biografía",
    bioPlaceholder: "Cuéntanos sobre tu viaje académico...",
    profileUpdated: "Perfil actualizado",
    saveChanges: "Guardar cambios",
    notificationPreferences: "Preferencias de notificación",
    emailNotifications: "Notificaciones por correo",
    receiveClassUpdates: "Recibir actualizaciones de clase por correo",
    pushNotifications: "Notificaciones push",
    browserNotifications: "Notificaciones del navegador para eventos",
    dailyDigest: "Resumen diario",
    summaryDaily: "Resumen de actividad enviado diariamente",
    security: "Seguridad",
    appearance: "Apariencia",
    language: "Idioma",
    securitySettings: "Configuración de seguridad",
    twoFactor: "Autenticación de dos factores",
    addExtraSecurity: "Añade seguridad adicional a tu cuenta",
    sessionTimeout: "Tiempo de espera de sesión (minutos)",
    theme: "Tema",
    fontSize: "Tamaño de fuente",
    languageSettings: "Ajustes de idioma",
    preferredLanguage: "Idioma preferido",
    light: "Claro",
    dark: "Oscuro",
    auto: "Automático",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",

    // OverviewPage
    classroomQuiet: "Tu aula está en silencio.",
    classroomQuietDesc: "Crea una clase o únete a una con un código para comenzar. Usa el botón + en la esquina superior derecha.",
    
    // CalendarPage
    syncingSchedule: "Sincronizando tu horario...",
    assignmentsTracked: "tareas registradas",
    today: "Hoy",
    upcomingAgenda: "Próxima Agenda",
    noDeadlines: "No se encontraron fechas límite próximas.",
    legend: "Leyenda",
    coreAcademics: "Académico Principal",
    specialProjects: "Proyectos Especiales",
    deadlines: "Fechas límite",
    
    // AssignmentsPage
    assignmentsHub: "Centro de Tareas",
    manageWorkload: "Gestiona tu carga académica y fechas límite",
    pending: "Pendientes",
    completed: "Completadas",
    tasks: "Tareas",
    currentAssignments: "Tareas Actuales",
    allStatus: "Todos los estados",
    submitted: "Enviado",
    graded: "Calificado",
    assignment: "Tarea",
    sphere: "Esfera",
    deadline: "Fecha límite",
    status: "Estado",
    action: "Acción",
    pointsAvailable: "Puntos disponibles",
    noAssignments: "No se encontraron tareas.",
    noDeadline: "Sin fecha límite",

    // MessagesPage
    chatsSearch: "Buscar chats...",
    noConversations: "Aún no hay conversaciones",
    startedConversation: "Comenzó una conversación",
    noMessagesYet: "Aún no hay mensajes aquí",
    typeMessage: "Escribe tu mensaje...",
    communicationHub: "Tu Centro de Comunicación",
    communicationHubDesc: "Selecciona un ciudadano para iniciar una conversación segura o busca a alguien nuevo.",
    startNewChat: "Iniciar nuevo chat",
    findCitizen: "Buscar ciudadano",
    typeUsername: "Escribe el nombre de usuario...",
    noCitizensFound: "No se encontraron ciudadanos",
  },
  French: {
    // Sidebar
    administration: "Administration",
    commandCenter: "Centre de Commande",
    citizens: "Citoyens",
    spheres: "Sphères",
    main: "Principal",
    home: "Accueil",
    messages: "Messages",
    assignments: "Devoirs",
    calendar: "Calendrier",
    settings: "Paramètres",
    myClasses: "Mes Classes",
    noClassesYet: "Pas encore de classes",
    
    // TopNavbar
    joinClass: "Rejoindre le cours",
    createClass: "Créer un cours",
    notifications: "Notifications",
    markAllAsRead: "Tout marquer comme lu",
    noNotificationsYet: "Aucune notification pour le moment",
    viewAllActivity: "Voir toute l'activité",
    mySpheres: "Mes Sphères",
    noSpheresYet: "Pas encore de sphères",
    joinNewSphere: "Rejoindre une nouvelle sphère",
    accountSettings: "Paramètres du compte",
    signOut: "Déconnexion",
    
    // SettingsPage
    configureSphere: "Configurez votre expérience personnelle",
    profile: "Profil",
    publicProfile: "Profil Public",
    profilePicture: "Photo de profil",
    pngJpgMax: "PNG ou JPG, max 5Mo",
    change: "Modifier",
    username: "Nom d'utilisateur",
    emailAddress: "Adresse e-mail",
    bio: "Biographie",
    bioPlaceholder: "Parlez-nous de votre parcours académique...",
    profileUpdated: "Profil mis à jour",
    saveChanges: "Enregistrer les modifications",
    notificationPreferences: "Préférences de notification",
    emailNotifications: "Notifications par e-mail",
    receiveClassUpdates: "Recevoir les mises à jour par e-mail",
    pushNotifications: "Notifications push",
    browserNotifications: "Notifications du navigateur pour les événements",
    dailyDigest: "Résumé quotidien",
    summaryDaily: "Résumé de l'activité envoyé quotidiennement",
    security: "Sécurité",
    appearance: "Apparence",
    language: "Langue",
    securitySettings: "Paramètres de sécurité",
    twoFactor: "Authentification à deux facteurs",
    addExtraSecurity: "Ajouter une sécurité supplémentaire à votre compte",
    sessionTimeout: "Délai de session (minutes)",
    theme: "Thème",
    fontSize: "Taille de police",
    languageSettings: "Paramètres de langue",
    preferredLanguage: "Langue préférée",
    light: "Clair",
    dark: "Sombre",
    auto: "Auto",
    small: "Petit",
    medium: "Moyen",
    large: "Grand",

    // OverviewPage
    classroomQuiet: "Votre classe est calme.",
    classroomQuietDesc: "Créez un cours ou rejoignez-en un avec un code pour commencer. Utilisez le bouton + en haut à droite.",
    
    // CalendarPage
    syncingSchedule: "Synchronisation de votre calendrier...",
    assignmentsTracked: "devoirs suivis",
    today: "Aujourd'hui",
    upcomingAgenda: "Agenda à venir",
    noDeadlines: "Aucune date limite à venir trouvée.",
    legend: "Légende",
    coreAcademics: "Études fondamentales",
    specialProjects: "Projets spéciaux",
    deadlines: "Dates limites",
    
    // AssignmentsPage
    assignmentsHub: "Centre des Devoirs",
    manageWorkload: "Gerez votre charge de travail et vos dates limites",
    pending: "En cours",
    completed: "Terminés",
    tasks: "Tâches",
    currentAssignments: "Devoirs Actuels",
    allStatus: "Tous les statuts",
    submitted: "Soumis",
    graded: "Noté",
    assignment: "Devoir",
    sphere: "Sphère",
    deadline: "Date limite",
    status: "Statut",
    action: "Action",
    pointsAvailable: "Points disponibles",
    noAssignments: "Aucun devoir trouvé.",
    noDeadline: "Pas de date limite",

    // MessagesPage
    chatsSearch: "Rechercher des discussions...",
    noConversations: "Pas encore de conversations",
    startedConversation: "A commencé une conversation",
    noMessagesYet: "Aucun message ici pour le moment",
    typeMessage: "Tapez votre message...",
    communicationHub: "Votre Centre de Communication",
    communicationHubDesc: "Sélectionnez un citoyen pour démarrer une conversation sécurisée ou recherchez quelqu'un de nouveau.",
    startNewChat: "Démarrer un nouveau chat",
    findCitizen: "Trouver un citoyen",
    typeUsername: "Tapez le nom d'utilisateur...",
    noCitizensFound: "Aucun citoyen trouvé",
  },
  German: {
    // Sidebar
    administration: "Verwaltung",
    commandCenter: "Kommandozentrale",
    citizens: "Bürger",
    spheres: "Sphären",
    main: "Hauptmenü",
    home: "Startseite",
    messages: "Nachrichten",
    assignments: "Aufgaben",
    calendar: "Kalender",
    settings: "Einstellungen",
    myClasses: "Meine Klassen",
    noClassesYet: "Noch keine Klassen",
    
    // TopNavbar
    joinClass: "Kurs beitreten",
    createClass: "Kurs erstellen",
    notifications: "Benachrichtigungen",
    markAllAsRead: "Alle als gelesen markieren",
    noNotificationsYet: "Noch keine Benachrichtigungen",
    viewAllActivity: "Alle Aktivitäten anzeigen",
    mySpheres: "Meine Sphären",
    noSpheresYet: "Noch keine Sphären",
    joinNewSphere: "Neuer Sphäre beitreten",
    accountSettings: "Kontoeinstellungen",
    signOut: "Abmelden",
    
    // SettingsPage
    configureSphere: "Konfigurieren Sie Ihr persönliches Sphären-Erlebnis",
    profile: "Profil",
    publicProfile: "Öffentliches Profil",
    profilePicture: "Profilbild",
    pngJpgMax: "PNG oder JPG, max. 5MB",
    change: "Ändern",
    username: "Benutzername",
    emailAddress: "E-Mail-Adresse",
    bio: "Biografie",
    bioPlaceholder: "Erzählen Sie uns von Ihrer akademischen Reise...",
    profileUpdated: "Profil aktualisiert",
    saveChanges: "Änderungen speichern",
    notificationPreferences: "Benachrichtigungseinstellungen",
    emailNotifications: "E-Mail-Benachrichtigungen",
    receiveClassUpdates: "Kursaktualisierungen per E-Mail erhalten",
    pushNotifications: "Push-Benachrichtigungen",
    browserNotifications: "Browser-Benachrichtigungen für Ereignisse",
    dailyDigest: "Tägliche Zusammenfassung",
    summaryDaily: "Täglich gesendete Zusammenfassung der Aktivitäten",
    security: "Sicherheit",
    appearance: "Aussehen",
    language: "Sprache",
    securitySettings: "Sicherheitseinstellungen",
    twoFactor: "Zwei-Faktor-Authentifizierung",
    addExtraSecurity: "Fügen Sie Ihrem Konto zusätzliche Sicherheit hinzu",
    sessionTimeout: "Sitzungs-Timeout (Minuten)",
    theme: "Design",
    fontSize: "Schriftgröße",
    languageSettings: "Spracheinstellungen",
    preferredLanguage: "Bevorzugte Sprache",
    light: "Hell",
    dark: "Dunkel",
    auto: "Automatisch",
    small: "Klein",
    medium: "Mittel",
    large: "Groß",

    // OverviewPage
    classroomQuiet: "Ihr Klassenzimmer ist ruhig.",
    classroomQuietDesc: "Erstellen Sie eine Klasse oder treten Sie einer mit einem Code bei, um zu beginnen. Verwenden Sie die Schaltfläche + oben rechts.",
    
    // CalendarPage
    syncingSchedule: "Synchronisiere deinen Zeitplan...",
    assignmentsTracked: "Aufgaben verfolgt",
    today: "Heute",
    upcomingAgenda: "Kommende Agenda",
    noDeadlines: "Keine bevorstehenden Fristen gefunden.",
    legend: "Legende",
    coreAcademics: "Kernakademiker",
    specialProjects: "Spezielle Projekte",
    deadlines: "Fristen",
    
    // AssignmentsPage
    assignmentsHub: "Aufgaben-Hub",
    manageWorkload: "Verwalte deine akademische Arbeitslast und Fristen",
    pending: "Ausstehend",
    completed: "Abgeschlossen",
    tasks: "Aufgaben",
    currentAssignments: "Aktuelle Aufgaben",
    allStatus: "Alle Status",
    submitted: "Eingereicht",
    graded: "Benotet",
    assignment: "Aufgabe",
    sphere: "Sphäre",
    deadline: "Frist",
    status: "Status",
    action: "Aktion",
    pointsAvailable: "Punkte verfügbar",
    noAssignments: "Keine Aufgaben gefunden.",
    noDeadline: "Keine Frist",

    // MessagesPage
    chatsSearch: "Chats durchsuchen...",
    noConversations: "Noch keine Gespräche",
    startedConversation: "Hat ein Gespräch begonnen",
    noMessagesYet: "Hier gibt es noch keine Nachrichten",
    typeMessage: "Schreiben Sie eine Nachricht...",
    communicationHub: "Ihre Kommunikationszentrale",
    communicationHubDesc: "Wählen Sie einen Bürger aus, um ein sicheres Gespräch zu beginnen, oder suchen Sie nach jemandem.",
    startNewChat: "Neuen Chat starten",
    findCitizen: "Bürger finden",
    typeUsername: "Benutzername eingeben...",
    noCitizensFound: "Keine Bürger gefunden",
  },
  Chinese: {
    // Sidebar
    administration: "管理端",
    commandCenter: "控制中心",
    citizens: "成员管理",
    spheres: "班级空间",
    main: "主页",
    home: "首页",
    messages: "消息通知",
    assignments: "作业任务",
    calendar: "日程日历",
    settings: "系统设置",
    myClasses: "我的班级",
    noClassesYet: "暂无班级",
    
    // TopNavbar
    joinClass: "加入班级",
    createClass: "创建班级",
    notifications: "消息通知",
    markAllAsRead: "全部标记为已读",
    noNotificationsYet: "暂无新通知",
    viewAllActivity: "查看全部动态",
    mySpheres: "我的班级空间",
    noSpheresYet: "暂无班级空间",
    joinNewSphere: "加入新班级空间",
    accountSettings: "账号设置",
    signOut: "安全退出",
    
    // SettingsPage
    configureSphere: "配置您的个性化班级空间体验",
    profile: "个人资料",
    publicProfile: "公开资料",
    profilePicture: "个人头像",
    pngJpgMax: "PNG 或 JPG 格式，最大 5MB",
    change: "更换头像",
    username: "用户名",
    emailAddress: "电子邮箱",
    bio: "个人简介",
    bioPlaceholder: "介绍一下您的学术生涯...",
    profileUpdated: "个人资料已更新",
    saveChanges: "保存修改",
    notificationPreferences: "通知偏好设置",
    emailNotifications: "邮件通知",
    receiveClassUpdates: "通过邮件接收班级更新动态",
    pushNotifications: "推送通知",
    browserNotifications: "事件的浏览器弹窗通知",
    dailyDigest: "每日摘要",
    summaryDaily: "每日发送活动内容汇总邮件",
    security: "安全",
    appearance: "外观",
    language: "语言",
    securitySettings: "安全设置",
    twoFactor: "双重身份验证",
    addExtraSecurity: "为您的账号增加额外的安全防护",
    sessionTimeout: "会话超时（分钟）",
    theme: "主题界面",
    fontSize: "字体大小",
    languageSettings: "语言设置",
    preferredLanguage: "首选语言",
    light: "浅色模式",
    dark: "深色模式",
    auto: "跟随系统",
    small: "较小",
    medium: "中等",
    large: "较大",

    // OverviewPage
    classroomQuiet: "您的班级非常安静。",
    classroomQuietDesc: "创建班级或使用代码加入班级以开始。使用右上角的 + 按钮。",
    
    // CalendarPage
    syncingSchedule: "正在同步您的日程安排...",
    assignmentsTracked: "个已追踪的作业",
    today: "今天",
    upcomingAgenda: "近期日程",
    noDeadlines: "暂无临近的截止日期。",
    legend: "图例说明",
    coreAcademics: "核心课程",
    specialProjects: "专题项目",
    deadlines: "截止任务",
    
    // AssignmentsPage
    assignmentsHub: "作业中心",
    manageWorkload: "管理您的学习任务与截止时间",
    pending: "待完成",
    completed: "已完成",
    tasks: "任务",
    currentAssignments: "当前作业列表",
    allStatus: "全部状态",
    submitted: "已提交",
    graded: "已评分",
    assignment: "作业名称",
    sphere: "所属班级空间",
    deadline: "截止时间",
    status: "状态",
    action: "操作",
    pointsAvailable: "满分分值",
    noAssignments: "未找到相关作业。",
    noDeadline: "无截止日期",

    // MessagesPage
    chatsSearch: "搜索聊天...",
    noConversations: "暂无聊天会话",
    startedConversation: "发起了对话",
    noMessagesYet: "这里还没有消息",
    typeMessage: "输入消息...",
    communicationHub: "您的通信中心",
    communicationHubDesc: "选择一位班级成员开始安全对话，或搜索新成员。",
    startNewChat: "发起新聊天",
    findCitizen: "查找成员",
    typeUsername: "输入用户名...",
    noCitizensFound: "未找到该成员",
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState('medium');
  const [accentColor, setAccentColor] = useState('teal');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    const savedLanguage = localStorage.getItem('appLanguage') || 'English';
    const savedFontSize = localStorage.getItem('appFontSize') || 'medium';
    const savedAccentColor = localStorage.getItem('appAccentColor') || 'teal';

    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setFontSize(savedFontSize);
    setAccentColor(savedAccentColor);

    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
    applyAccentColor(savedAccentColor);

    // Watch for media query preference shifts if in 'auto' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const currentTheme = localStorage.getItem('appTheme') || 'light';
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const applyTheme = (newTheme) => {
    const isDark = newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const applyFontSize = (size) => {
    document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.documentElement.classList.add(`font-size-${size}`);
  };

  const applyAccentColor = (color) => {
    document.documentElement.classList.remove('accent-teal', 'accent-indigo', 'accent-rose', 'accent-emerald', 'accent-violet');
    document.documentElement.classList.add(`accent-${color}`);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    applyTheme(newTheme);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('appLanguage', newLanguage);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLanguage } }));
  };

  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('appFontSize', newSize);
    applyFontSize(newSize);
  };

  const changeAccentColor = (newColor) => {
    setAccentColor(newColor);
    localStorage.setItem('appAccentColor', newColor);
    applyAccentColor(newColor);
  };

  const t = (key) => {
    const langDict = translations[language] || translations['English'];
    return langDict[key] || translations['English'][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      language, 
      changeLanguage,
      fontSize,
      changeFontSize,
      accentColor,
      changeAccentColor,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
