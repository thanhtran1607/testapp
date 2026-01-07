const config = {
    GO2RTC_URL: 'http://192.168.6.146:1985',
    
    // Authentication cho camera API (nếu cần)
    AUTH: {
        enabled: false, // Set true nếu cần login
        username: 'admin',
        password: 'your_password',
    },
    
    // Tạo URL với Basic Auth
    getAuthUrl: (baseUrl: string) => {
        if (!config.AUTH.enabled) return baseUrl;
        
        const url = new URL(baseUrl);
        url.username = config.AUTH.username;
        url.password = config.AUTH.password;
        return url.toString();
    },
    
    // Tạo Authorization header
    getAuthHeaders: () => {
        if (!config.AUTH.enabled) return {};
        
        const credentials = btoa(`${config.AUTH.username}:${config.AUTH.password}`);
        return {
            Authorization: `Basic ${credentials}`,
        };
    },
};

export default config;