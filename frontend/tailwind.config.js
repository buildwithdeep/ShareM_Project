export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            screens: {
                xs: '480px',
            },
            colors: {
                primary: '#0f172a',
                secondary: '#1e293b',
                success: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
                accent: '#38bdf8',
                accent2: '#2dd4bf',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif']
            }
        }
    },
    plugins: []
}