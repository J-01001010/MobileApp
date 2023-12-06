const wrapper = document.querySelector(".wrapper");
        const qrInput = wrapper.querySelector(".form input");
        const qrImg = wrapper.querySelector(".qr-code img");
        const generateBtn = wrapper.querySelector(".form button");

        generateBtn.addEventListener("click", () => {
            let qrValue = qrInput.value;
            if (!qrValue) return;
            generateBtn.innerText = "Generating QR Code....";
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`;
            qrImg.addEventListener("load", () => {
                wrapper.classList.add("active");
                generateBtn.innerText = "Generate QR Code";
            });
        });

        qrInput.addEventListener("keyup", () => {
            if (!qrInput.value) {
                wrapper.classList.remove("active");
            }
        });
        // Download QR Code
        document.getElementById("downloadBtn").addEventListener("click", () => {
            const canvas = document.querySelector("canvas");
            const dataUrl = canvas.toDataURL("image/png");

            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = "qrcode.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });