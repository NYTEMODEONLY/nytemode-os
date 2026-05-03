# Desktop Icon Template

This template provides a quick reference for adding new desktop icons to NYTEMODE OS.

## 📋 Quick Checklist

- [ ] Icon files prepared (multiple resolutions)
- [ ] .url shortcut file created with proper naming
- [ ] Cache files regenerated
- [ ] Testing completed
- [ ] Documentation updated

## 🖼️ Icon File Structure

```
public/System/Icons/
├── your_app_icon.png          # Main icon (96x96 or higher)
├── 48x48/your_app_icon.png    # 48x48 version
├── 32x32/your_app_icon.png    # 32x32 version (optional)
└── 16x16/your_app_icon.png    # 16x16 version (optional)
```

## 📄 .url File Template

**Filename**: `public/Users/Public/Desktop/YourApp.url`

**⚠️ Important**: Use PascalCase with no spaces (e.g., "MyApp.url" not "My App.url")

```ini
[InternetShortcut]
BaseURL=ExternalURL
Comment=Your App - Brief Description
IconFile=/System/Icons/your_app_icon.png
Type=System
URL=https://your-app-url.com
```

## 🔧 Required Commands

```bash
# After creating files, regenerate cache
npm run build:prebuild

# Test in development
npm run dev
```

## ✅ Verification Steps

1. **Check shortcut cache**:

   ```bash
   # Look for your app in this file
   cat public/.index/shortcutCache.json | grep -i "yourapp"
   ```

2. **Check desktop icons**:

   ```bash
   # Verify icon is included
   cat public/.index/desktopIcons.json
   ```

3. **Visual test**:
   - Start dev server: `npm run dev`
   - Open http://localhost:3000
   - Verify icon appears on desktop
   - Click to test functionality

## 📝 Examples

### Example 1: Calculator App

```ini
[InternetShortcut]
BaseURL=ExternalURL
Comment=Calculator - Basic Math Operations
IconFile=/System/Icons/calculator_icon.png
Type=System
URL=https://calculator.app
```

### Example 2: Music Player

```ini
[InternetShortcut]
BaseURL=ExternalURL
Comment=Music Player - Stream Your Favorites
IconFile=/System/Icons/music_icon.png
Type=System
URL=https://musicplayer.com
```

### Example 3: Code Editor

```ini
[InternetShortcut]
BaseURL=ExternalURL
Comment=Code Editor - Professional Development
IconFile=/System/Icons/editor_icon.png
Type=System
URL=https://codeeditor.dev
```

## 🎨 Icon Design Guidelines

### Size Requirements

- **Minimum**: 48x48 pixels
- **Recommended**: 96x96 pixels or higher
- **Format**: PNG preferred, WebP supported
- **Background**: Transparent preferred

### Visual Style

- Modern, clean design
- High contrast for visibility
- Consistent with existing icon style
- Works well at small sizes (16x16)

### File Naming

- Use lowercase with underscores: `app_name_icon.png`
- Be descriptive but concise
- Avoid special characters

## 🛠️ Troubleshooting

### Icon Not Showing

1. Check filename has no spaces
2. Verify icon file exists at specified path
3. Ensure .url file follows exact template format
4. Regenerate cache: `npm run build:prebuild`
5. Clear browser cache and reload

### Cache Issues

```bash
# Force regenerate all cache files
npm run build:prebuild

# Check if file was processed
ls -la public/.index/
```

### Positioning Issues

- Icons auto-position by default
- Manual positioning stored in session data
- Reset positioning by clearing browser storage

## 📚 Related Files

- **Cache Generation**: `scripts/cacheShortcuts.js`
- **Icon Processing**: `scripts/preloadIcons.js`
- **Desktop Component**: `components/system/Desktop/index.tsx`
- **File Manager**: `components/system/Files/FileManager/index.tsx`
- **Project Rules**: `NYTEMODE_OS_PROJECT_RULES.md`

## 🚀 Advanced Options

### Custom BaseURL Types

- `ExternalURL` - External web applications
- `FileExplorer` - Internal file system paths
- `Browser` - Browser-specific URLs
- Custom app names for internal applications

### Multiple Icon Sizes

```
48x48/    # Standard desktop size
32x32/    # Medium size
16x16/    # Small/taskbar size
96x96/    # High-DPI displays
144x144/  # Extra high-DPI
```

---

**Template Version**: 1.0
**Last Updated**: 2026-05-03 (re-verified during dormancy revisit)
**Compatibility**: NYTEMODE OS — current `main`. The recipe still matches the actual scripts in `scripts/cacheShortcuts.js` and `scripts/preloadIcons.js`.
