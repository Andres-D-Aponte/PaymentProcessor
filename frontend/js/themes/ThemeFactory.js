export class ThemeFactory {
  createTheme() {
    throw new Error('Method createTheme() must be implemented');
  }
}

export class LightThemeFactory extends ThemeFactory {
  createTheme() {
    return {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      borderColor: '#dee2e6',
      panelBackground: '#f8f9fa'
    };
  }
}

export class DarkThemeFactory extends ThemeFactory {
  createTheme() {
    return {
      primaryColor: '#0d6efd',
      secondaryColor: '#495057',
      backgroundColor: '#212529',
      textColor: '#ffffff',
      borderColor: '#495057',
      panelBackground: '#2b3035'
    };
  }
}

export class BlueLightThemeFactory extends ThemeFactory {
  createTheme() {
    return {
      primaryColor: '#0066cc',
      secondaryColor: '#5c8eb8',
      backgroundColor: '#e6f3ff',
      textColor: '#003366',
      borderColor: '#99ccff',
      panelBackground: '#f0f8ff'
    };
  }
}