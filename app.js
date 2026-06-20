const imageInput = document.getElementById("imageInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const scanBtn = document.getElementById("scanBtn");

function formatBytes(bytes) {

    if (bytes < 1024) return bytes + " B";

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

async function sha256(file) {

    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        buffer
    );

    return Array
        .from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

scanBtn.addEventListener("click", scanImages);

async function scanImages() {

    const files = [...imageInput.files];

    if (files.length === 0) {
        alert("Vui lòng chọn ảnh.");
        return;
    }

    scanBtn.disabled = true;
    loading.innerHTML = "<p>Đang quét...</p>";
    result.innerHTML = "";

    const hashMap = new Map();

    let totalSize = 0;

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        totalSize += file.size;

        loading.innerHTML =
            `<p>Đang quét ${i + 1}/${files.length}</p>`;

        const hash = await sha256(file);

        if (!hashMap.has(hash)) {
            hashMap.set(hash, []);
        }

        hashMap.get(hash).push(file);
    }

    const duplicateFiles = [];
    let duplicateSize = 0;

    hashMap.forEach(group => {

        if (group.length > 1) {

            for (let i = 1; i < group.length; i++) {

                duplicateFiles.push(group[i]);
                duplicateSize += group[i].size;
            }
        }
    });

    let html = `
        <h2>Kết quả</h2>

        <p><strong>Tổng ảnh:</strong> ${files.length}</p>

        <p><strong>Tổng dung lượng:</strong>
        ${formatBytes(totalSize)}</p>

        <p><strong>Ảnh trùng:</strong>
        ${duplicateFiles.length}</p>

        <p><strong>Có thể giải phóng:</strong>
        ${formatBytes(duplicateSize)}</p>
    `;

    if (duplicateFiles.length > 0) {

        html += `
            <h3>Danh sách ảnh trùng</h3>
            <ul class="duplicate-list">
        `;

        duplicateFiles.forEach(file => {

            html += `
                <li>
                    <strong>${file.name}</strong><br>
                    ${formatBytes(file.size)}
                </li>
            `;
        });

        html += "</ul>";

        html += `
            <div class="warning">
                ⚠️ Trình duyệt không thể xóa file trực tiếp.

                Hãy mở thư viện ảnh và xóa các file trên.
            </div>
        `;
    }

    result.innerHTML = html;

    loading.innerHTML = "";
    scanBtn.disabled = false;
}
