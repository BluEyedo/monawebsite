// المجال الإشرافي
function findSelectedScope(value) {
    const types = {
        "1": "نواتج التعلم",
        "2": "الأنشطة المدرسية",
        "3": "التوجيه الطلابي",
        "4": "التطوير المدرسي",
    }
    return types[value] || "غير محدد";
}

// النوع
function findSelectedType(value) {
    const types = {
        "1": "حضوري",
        "2": "عن بعد",
    }
    return types[value] || "غير محدد";
}