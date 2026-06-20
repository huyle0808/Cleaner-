const imageInput = document.getElementById("imageInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const scanBtn = document.getElementById("scanBtn")

function formatBytes(bytes) {

    if (bytes < 1024) return bytes + " B";

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function hammingDistance(a, b) {

    let distance = 0;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) distance++;
    }

    return distance;
}

async function getImageHash(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = async function () {

            try {

                const hash = await imghash.hash(
                    reader.result,
                    16,
                    "phash"
                );

                resolve(hash);

            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

async function scanImages() {

    const files = [...document
        .getElementById("imageInput")
        .files];

    if (files.length === 0) {
        alert("Chưa chọn ảnh");
        return;
    }

    const result = document.getElementById("result");

    result.innerHTML = "<p>Đang phân tích ảnh...</p>";

    const imageData = [];

    for (let i = 0; i < files.length; i++) {

        result.innerHTML =
            `<p>Đang xử lý ${i + 1}/${files.length}</p>`;

        const hash = await getImageHash(files[i]);

        imageData.push({
            file: files[i],
            hash
        });
    }

    const duplicateGroups = [];
    const used = new Set();

    const MAX_DISTANCE = 8;

    for (let i = 0; i < imageData.length; i++) {

        if (used.has(i)) continue;

        const group = [imageData[i]];

        for (let j = i + 1; j < imageData.length; j++) {

            if (used.has(j)) continue;

            const distance = hammingDistance(
                imageData[i].hash,
                imageData[j].hash
            );

            if (distance <= MAX_DISTANCE) {

                group.push(imageData[j]);

                used.add(j);
            }
        }

        if (group.length > 1) {
            duplicateGroups.push(group);
        }
    }

    let duplicateCount = 0;
    let duplicateSize = 0;

    let html = `
        <h2>Kết quả</h2>
        <p>Tổng ảnh: ${files.length}</p>
    `;

    duplicateGroups.forEach((group, index) => {

        html += `<h3>Nhóm ${index + 1}</h3><ul>`;

        group.forEach((item, idx) => {

            html += `
                <li>
                    ${item.file.name}
                    (${formatBytes(item.file.size)})
                    ${idx === 0 ? " ⭐ Giữ lại" : ""}
                </li>
            `;

            if (idx > 0) {
                duplicateCount++;
                duplicateSize += item.file.size;
            }
        });

        html += "</ul>";
    });

    html += `
        <hr>

        <p><strong>Ảnh giống nhau:</strong>
        ${duplicateCount}</p>

        <p><strong>Có thể giải phóng:</strong>
        ${formatBytes(duplicateSize)}</p>
    `;

    if (duplicateCount > 0) {

        html += `
            <div style="
                padding:12px;
                background:#fff3cd;
                border-radius:8px;
                margin-top:20px;
            ">
                ⚠️ Trình duyệt không thể xóa ảnh trực tiếp.

                Hãy xóa thủ công các ảnh không có dấu ⭐.
            </div>
        `;
    }

    result.innerHTML = html;
}
