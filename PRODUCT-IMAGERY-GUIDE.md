# Product Imagery Styleguide

This guide outlines our approach to product imagery based on Refactoring UI principles.

## Core Principles

1. **Optimize images for legibility and impact**
   - Use clear, high-contrast product photography
   - Maintain consistent aspect ratios
   - Ensure products are the focal point

2. **Create depth with shadows and layering**
   - Use subtle shadows to lift products off the background
   - Create visual hierarchy through layering

3. **Pay attention to small details**
   - Consistent file naming
   - Proper image dimensions
   - Optimized file sizes

## Image Requirements

### Dimensions & Format

| Image Type | Dimensions | Format | Max Size |
|------------|------------|--------|----------|
| Product    | 500×500px  | JPG/PNG | 200KB    |
| Banner     | 1200×400px | JPG/PNG | 300KB    |
| Thumbnail  | 100×100px  | JPG/PNG | 50KB     |

### Naming Convention

All product images should follow this naming pattern:
```
[flavor]-[strength]mg.jpg
```

Examples:
- `apple-mint-6mg.jpg`
- `cool-mint-16mg.jpg`
- `spearmint-22mg.jpg`

Banners should be named:
- `banner.jpg`
- `banner-[specific].jpg`

### Visual Style

1. **Background**
   - Clean white or light gray background (#F8F9FA)
   - No busy patterns or distractions

2. **Lighting**
   - Soft, even lighting
   - Gentle shadows to create depth
   - No harsh reflections

3. **Product Presentation**
   - Consistent product angle (45° or straight-on)
   - Product should fill ~80% of the image canvas
   - Accurate color representation

## Using Our Components

We've developed standardized components to ensure consistent presentation:

### ProductImage Component

```tsx
<ProductImage 
  src="/images/products/apple-mint-6mg.jpg"
  alt="Apple Mint 6mg Nicotine Pouch"
  size="medium" // thumbnail, small, medium, large
  aspectRatio="1:1" // 1:1, 4:3, 16:9
  objectFit="contain" // contain, cover
/>
```

### ProductCard Component

```tsx
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  isWholesale={isWholesale}
  isInCart={isInCart}
/>
```

## Optimization Workflow

1. Prepare images in proper dimensions and format
2. Compress images using TinyPNG or similar tool
3. Name files according to convention
4. Place in `/public/images/products/`
5. Run the check-image-size script to validate
6. Use our optimized components for rendering

## Visual Examples

### Product Images
Each product should be photographed with consistent lighting, angle, and focus.

### Product Card
The product card component automatically handles loading states, error fallbacks, and consistent presentation.

### Banners
Banner images should be wide format, with clear text space for overlays.

---

By following these guidelines, we ensure a consistent, professional presentation of our products that aligns with our brand values of quality, clarity, and attention to detail.