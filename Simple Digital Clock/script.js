const clock= document.getElementById("clock");
const date= document.getElementById("date");
const time = document.getElementById("time");

function updateClock(){
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    date.textContent = now.toLocaleDateString(undefined, options);
    time.textContent = now.toLocaleTimeString(undefined, timeOptions);
}

setInterval(updateClock, 1000);

updateClock(); // Initial call to display the clock immediately

/* ملاحظات 

1. toLocaleDateString() و toLocaleTimeString() بيحولوا التاريخ والوقت لصيغة محلية حسب اعدادات الجهاز
2. setInterval() بيشغل دالة معينة كل فترة زمنية محددة (هنا كل ثانية)
3. الدالة updateClock() بيقوم بتحديث محتوى العناصر الرئيسية في الصفحة
4. الخيارات اللي بنمررها في toLocaleDateString() و toLocaleTimeString() بتحدد شكل العرض (زي اسم اليوم، الشهر، السنة، الساعة، الدقيقة، الثانية)
5. undefined في toLocaleDateString() معناه انه هيستخدم الاعدادات الافتراضية للجهاز


*/