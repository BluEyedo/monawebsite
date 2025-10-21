function findDay(dateString) {
    const [year, month, day] = dateString.split("-");

    // Create date in UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, parseInt(month) - 1, day));

    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    return days[date.getUTCDay()]; // use getUTCDay for UTC
}