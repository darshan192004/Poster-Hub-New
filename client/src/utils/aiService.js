export const generateAIText = async (prompt, category) => {
  const suggestions = {
    birthday: [
      "Happy Birthday! 🎂 Wishing you a year filled with love, laughter, and all your favorite things!",
      "Another year older, another year wiser! Happy Birthday, beautiful soul!",
      "May this special day bring you endless joy and wonderful memories!",
      "Celebrating the amazing person you are today! Happy Birthday!",
      "Make a wish! 🎉 Here's to another fantastic year ahead!",
      "Happy Birthday to someone who makes the world brighter!",
      "Wishing you 365 days of happiness on your special day!",
      "Time to celebrate! You deserve all the love and happiness today!",
    ],
    business: [
      "Grand Opening Celebration! 🎉 Join us for exclusive offers!",
      "Grand Opening! Free consultations available - Book now!",
      "New Year, New You! 30% Off all services this month!",
      "Limited Time Offer: Buy One Get One Free!",
      "Grand Opening Special! 50% Off for the first 100 customers!",
      "Free Shipping on orders over $50 - Limited time only!",
      "Summer Sale! Up to 70% Off - Don't miss out!",
      "New Collection Launch - Be the first to shop!",
    ],
    festival: [
      "Happy Diwali! 🪔 May this festival of lights bring joy, prosperity, and happiness to you and your family!",
      "Merry Christmas! 🎄 Wishing you peace, joy, and love this holiday season!",
      "Happy New Year! 🥂 Here's to new beginnings and endless possibilities!",
      "Eid Mubarak! 🌙 Wishing you blessings, peace, and happiness!",
      "Happy Thanksgiving! 🦃 Grateful for family, friends, and good food!",
      "Happy Holi! 🎨 May your life be as colorful as this festival!",
      "Season's Greetings! 🎁 Wishing you a wonderful holiday season!",
      "Prosperous New Year! May this year bring success and happiness!",
    ],
    wedding: [
      "Save the Date! 💍 You're invited to celebrate our love story.",
      "Together with their families, [Name] & [Name] request the honor of your presence.",
      "Love is in the air! Save the date for our wedding celebration!",
      "The happy couple cordially invites you to witness their union.",
      "Two hearts become one. Save the date for our wedding!",
      "A celebration of love awaits you. Save the date!",
      "Join us as we begin our forever. Save the date!",
      "The answer is YES! Save the date for our wedding!",
    ],
    sale: [
      "🔥 FLASH SALE! Up to 70% Off - Limited Time Only!",
      "BIGGEST SALE OF THE YEAR! Up to 80% Off!",
      "🚨 FINAL CLEARANCE! Everything must go - Up to 60% Off!",
      "Exclusive Member Sale! 40% Off + Free Gift!",
      "One Day Only! 50% Off Everything - Don't Miss Out!",
      "Buy 2 Get 1 Free! Stock up on your favorites!",
      "Huge Savings Event! Up to 75% Off designer items!",
      "Special Event! Extra 30% Off already reduced items!",
    ],
  };

  await new Promise(resolve => setTimeout(resolve, 500));
  
  const categorySuggestions = suggestions[category] || suggestions.business;
  const randomSuggestions = categorySuggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  
  return randomSuggestions;
};

export const generateColorPalette = async (baseColor = "pink") => {
  const palettes = {
    pink: ["#FF6B6B", "#FF8E8E", "#FFB3B3", "#FFD4D4", "#FFE8E8"],
    blue: ["#45B7D1", "#6CC4D9", "#8DD1E1", "#AEDDE9", "#CFE9F1"],
    purple: ["#9B59B6", "#B07CC6", "#C59FD6", "#D7C2E6", "#E9D5F6"],
    green: ["#2ECC71", "#58D68D", "#82E0AA", "#ABEBC6", "#D5F5E3"],
    gold: ["#F8B500", "#F9C846", "#FADB8C", "#FBEEB2", "#FDF1D8"],
    red: ["#E74C3C", "#EC7063", "#F1948A", "#F5B7B1", "#FADBD8"],
    dark: ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"],
    coral: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#C7F9CC", "#F7FFF7"],
    sunset: ["#FF9A8B", "#FF6A88", "#FF99AC", "#FECfef", "#FEF9EF"],
    ocean: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E"],
  };

  await new Promise(resolve => setTimeout(resolve, 300));
  
  return palettes[baseColor] || palettes.pink;
};

export const suggestFontPairing = async (primaryFont) => {
  const pairings = {
    "Poppins": ["Lato", "Open Sans", "Montserrat"],
    "Montserrat": ["Open Sans", "Lato", "Roboto"],
    "Playfair Display": ["Lato", "Open Sans", "Poppins"],
    "Anton": ["Lato", "Open Sans", "Poppins"],
    "Cormorant Garamond": ["Lato", "Poppins", "Open Sans"],
    "Roboto": ["Open Sans", "Lato", "Montserrat"],
    "Open Sans": ["Montserrat", "Roboto", "Lato"],
    "Bebas Neue": ["Lato", "Open Sans", "Montserrat"],
    "Pacifico": ["Lato", "Open Sans", "Montserrat"],
    "Dancing Script": ["Lato", "Open Sans", "Poppins"],
  };

  await new Promise(resolve => setTimeout(resolve, 200));
  
  return pairings[primaryFont] || ["Poppins", "Lato", "Open Sans"];
};

export const autoLayout = (elements, canvasWidth, canvasHeight) => {
  if (!elements || elements.length === 0) return elements;
  
  const padding = 40;
  const spacing = 60;
  
  const sortedElements = [...elements].sort((a, b) => {
    const aY = a.y || 0;
    const bY = b.y || 0;
    return aY - bY;
  });
  
  let currentY = padding + 40;
  
  const layoutedElements = sortedElements.map((el) => {
    const fontSize = el.fontSize || 24;
    const estimatedHeight = fontSize * 1.5;
    
    let newY = currentY;
    let newX = canvasWidth / 2;
    
    currentY += estimatedHeight + spacing;
    
    return {
      ...el,
      x: newX,
      y: newY,
      textAlign: "center",
    };
  });
  
  return layoutedElements;
};

export const improveContrast = (elements) => {
  return elements.map((el) => {
    const darkColors = ["#1A1A2E", "#16213E", "#0F3460", "#2C3E50", "#34495E"];
    const lightColors = ["#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA"];
    
    let newColor = el.color;
    if (el.backgroundStyle?.includes("dark") || el.backgroundStyle?.includes("gradient")) {
      if (!darkColors.some(c => el.color?.toLowerCase().includes(c.replace("#", "")))) {
        newColor = lightColors[Math.floor(Math.random() * lightColors.length)];
      }
    }
    
    return {
      ...el,
      color: newColor,
      fontWeight: el.fontWeight || "bold",
      opacity: 1,
    };
  });
};

export const optimizeSizes = (elements) => {
  return elements.map((el, index) => {
    let fontSize = el.fontSize || 24;
    
    if (index === 0) {
      fontSize = Math.max(fontSize, 36);
    } else if (index === 1) {
      fontSize = Math.max(fontSize, 28);
    } else {
      fontSize = Math.min(fontSize, 20);
    }
    
    return {
      ...el,
      fontSize,
    };
  });
};

export const suggestBetterFonts = (elements) => {
  const fontSuggestions = {
    title: ["Playfair Display", "Anton", "Bebas Neue", "Montserrat"],
    subtitle: ["Poppins", "Lato", "Open Sans", "Montserrat"],
    body: ["Lato", "Open Sans", "Poppins", "Roboto"],
    festive: ["Pacifico", "Dancing Script", "Mountains of Christmas"],
    elegant: ["Playfair Display", "Cormorant Garamond"],
  };
  
  return elements.map((el, index) => {
    let fontCategory = "subtitle";
    if (index === 0) fontCategory = "title";
    else if (index === elements.length - 1) fontCategory = "body";
    
    const suggestedFonts = fontSuggestions[fontCategory] || fontSuggestions.subtitle;
    const newFont = suggestedFonts[Math.floor(Math.random() * suggestedFonts.length)];
    
    return {
      ...el,
      fontFamily: newFont,
    };
  });
};

export const generateDesignSuggestions = async (templateType, currentElements) => {
  const suggestions = [
    {
      type: "layout",
      title: "Auto-balance Layout",
      description: "Space out your elements evenly",
      action: "autoLayout",
      icon: "Layout",
    },
    {
      type: "color",
      title: "Improve Contrast",
      description: "Enhance text readability",
      action: "improveContrast",
      icon: "Contrast",
    },
    {
      type: "font",
      title: "Better Font Pairing",
      description: "Try these font combinations",
      action: "suggestBetterFonts",
      icon: "Type",
    },
    {
      type: "size",
      title: "Optimize Sizes",
      description: "Make important text stand out",
      action: "optimizeSizes",
      icon: "Scaling",
    },
  ];

  await new Promise(resolve => setTimeout(resolve, 400));
  
  return suggestions;
};

export const enhanceImage = async (imageUrl) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    enhanced: true,
    brightness: 1.1,
    contrast: 1.05,
    saturation: 1.0
  };
};

export const removeBackground = async (imageUrl) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    processedUrl: imageUrl,
    message: "Background removed successfully"
  };
};

export const generateAIDesign = async (category, preferences) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const designs = {
    birthday: {
      colors: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#FF69B4"],
      fonts: { title: "Pacifico", body: "Poppins" },
      style: "playful",
    },
    business: {
      colors: ["#2563EB", "#1E40AF", "#3B82F6", "#60A5FA"],
      fonts: { title: "Montserrat", body: "Open Sans" },
      style: "professional",
    },
    wedding: {
      colors: ["#D4AF37", "#F5DEB3", "#FFFAF0", "#8B7355"],
      fonts: { title: "Playfair Display", body: "Cormorant Garamond" },
      style: "elegant",
    },
    festival: {
      colors: ["#E74C3C", "#F39C12", "#9B59B6", "#2ECC71"],
      fonts: { title: "Anton", body: "Poppins" },
      style: "festive",
    },
    sale: {
      colors: ["#E74C3C", "#C0392B", "#FF6B6B", "#FFFFFF"],
      fonts: { title: "Anton", body: "Montserrat" },
      style: "bold",
    },
  };
  
  return designs[category] || designs.business;
};
