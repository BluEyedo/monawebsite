// formStorage.js


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const preview = document.getElementById("preview");
    const iframe = document.querySelector("iframe"); // تحديد iframe

    const scopeSelect = document.querySelector(`select[name="scope"]`);
    const pointerSelect = document.querySelector(`select[name="pointer"]`);
    const methodSelect = document.querySelector(`select[name="method"]`);

    var pointerContainer = document.getElementById("pointerContainer");
    var methodContainer = document.getElementById("methodContainer");



    scopeSelect.addEventListener("change", () => {
        if (scopeSelect.value != "") {
            pointerSelect.disabled = false;
            pointerSelect.parentElement.classList.remove("opacity-50")

            var pointerData = scopeJson.find(f => f.scopeId == scopeSelect.value).pointer;
            pointerSelect.innerHTML = `
            <option value="">اختيار مؤشر</option>
            ${pointerData.map((item, ix) => `
            <option value="${item.pointerId}">${item.label}</option>
            `)}
            <option value="add">أخرى</option>
            `
        } else {
            pointerSelect.disabled = true;
            pointerSelect.parentElement.classList.add("opacity-50")
        }
    })

    pointerSelect.addEventListener("change", () => {
        methodSelect.value = "";
        if (pointerSelect.value != "") {
            methodSelect.disabled = false;
            methodSelect.parentElement.classList.remove("opacity-50")

        } else {
            methodSelect.disabled = true;
            methodSelect.parentElement.classList.add("opacity-50")
        }

        if (typeof methodContainer.childNodes[1] != "undefined") {
            methodSelect.value = "";
            methodSelect.style.display = "block";
            methodContainer.childNodes[1].remove();
        }

        if (pointerSelect.value == "add") {
            pointerSelect.style.display = "none"
            pointerSelect.style.required = false;

            pointerContainer.innerHTML = `
            <div class="flex flex-row items-end gap-4">
            <input required placeholder="ادخل المؤشر" name="newPointer"
            class="border-b border-gray-500 w-full p-2 
            focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right" />
                <button class="cursor-pointer" id="closePointer" type="button">
                    <i class="bi bi-x-lg text-red-600"></i>
                </button>
            </div>`

            var pointerCloseBtn = document.querySelector("#pointerContainer #closePointer");
            pointerCloseBtn.addEventListener("click", () => {
                pointerSelect.style.required = true;
                if (typeof methodContainer.childNodes[1] != "undefined") {
                    methodSelect.value = "";
                    methodSelect.style.display = "block";
                    methodContainer.childNodes[1].remove();
                }
                pointerSelect.value = "";
                pointerSelect.style.display = "block";
                pointerContainer.childNodes[1].remove();
            })
        }
    })



    methodSelect.addEventListener("change", () => {
        if (methodSelect.value == "add") {
            methodSelect.style.display = "none"
            methodSelect.style.required = false;

            methodContainer.innerHTML = `
            <div class="flex flex-row items-end gap-4">
            <input required placeholder="ادخل الإجراء" name="newMethod"
            class="border-b border-gray-500 w-full p-2 
            focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right" />
                <button class="cursor-pointer" id="closePointer" type="button">
                    <i class="bi bi-x-lg text-red-600"></i>
                </button>
            </div>`

            var methodCloseBtn = document.querySelector("#methodContainer #closePointer");
            methodCloseBtn.addEventListener("click", () => {
                methodSelect.style.required = true;
                methodSelect.value = ""
                methodSelect.style.display = "block"
                methodContainer.childNodes[1].remove()
            })
        }
    })


    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // منع الإرسال الفعلي

        const formData = {};
        const elements = form.elements;

        // جمع البيانات
        formData.team = elements["team"].value;
        formData.advisorName = elements["advisorName"].value;
        formData.stage = elements["stage"].value;
        formData.school = elements["school"].value;
        formData.term = elements["term"].value; // الحقل الثاني job في textarea
        formData.scope = elements["scope"].value;
        formData.pointer = elements["pointer"].value;
        formData.method = elements["method"].value;

        formData.newPointer = elements["newPointer"]?.value ?? "";
        formData.newMethod = elements["newMethod"]?.value ?? "";

        // جلب البيانات الحالية من localStorage
        const currentData = JSON.parse(localStorage.getItem("excellenceReport") || "[]");
        currentData.push(formData);

        // حفظها مرة أخرى
        localStorage.setItem("excellenceReport", JSON.stringify(currentData));

        // إعادة ضبط النموذج
        form.reset();
        pointerSelect.style.required = true;

        if (pointerSelect.value == "add") {
            pointerSelect.value = "";
            pointerSelect.style.display = "block";
            pointerContainer.childNodes[1].remove();
        }

        if (methodSelect.value == "add") {
            methodSelect.style.required = true;
            methodSelect.value = ""
            methodSelect.style.display = "block"
            methodContainer.childNodes[1].remove()
        }

        // إعادة تحميل iframe تلقائياً
        if (iframe) {
            iframe.src = iframe.src;
        }

        // const data = JSON.parse(localStorage.getItem("excellenceReport") || "[]");
        // // حساب المهام المكتملة وغير المكتملة
        // const done = data.filter(item => item.category == "1").length;
        // const notDone = data.filter(item => item.category == "2").length;
        // // عرض الأرقام
        // document.getElementById("doneCount").textContent = `🟢 تم إنجازه: ${done}`;
        // document.getElementById("notDoneCount").textContent = `🔴 لم يتم إنجازه: ${notDone}`;

        alert("تم حفظ البيانات في LocalStorage بنجاح!");
    });

});
