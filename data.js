
/* =====================================
   KIẾN THỨC THẬP CẨM
   DỮ LIỆU MỤC LỤC LỚP 12
   Bộ sách: Kết nối tri thức
===================================== */

const STUDY_DATA = {

    settings: {
        websiteName: "Kiến thức thập cẩm",
        slogan: "Học dễ hiểu – Nhớ lâu – Thi hiệu quả",
        grade: 12,
        textbook: "Kết nối tri thức với cuộc sống"
    },

    subjects: [

        {
            id: "toan",
            name: "Toán học",
            icon: "📐",
            color: "#3B82F6",
            textbook: "Toán 12 - Kết nối tri thức",
            chapters: []
        },

        {
            id: "sinh",
            name: "Sinh học",
            icon: "🧬",
            color: "#16A34A",
            textbook: "Sinh học 12 - Kết nối tri thức",
            chapters: []
        },

        {
            id: "hoa",
            name: "Hóa học",
            icon: "🧪",
            color: "#A855F7",
            textbook: "Hóa học 12 - Kết nối tri thức",
            chapters: [
                {
                    id: "hoa-chuong-1",
                    name: "Chương 1. Ester – Lipid",
                    lessons: [
                        { id: "hoa-bai-1", name: "Bài 1. Ester – Lipid" },
                        { id: "hoa-bai-2", name: "Bài 2. Xà phòng và chất giặt rửa" },
                        { id: "hoa-bai-3", name: "Bài 3. Ôn tập chương 1" }
                    ]
                },
                {
                    id: "hoa-chuong-2",
                    name: "Chương 2. Carbohydrate",
                    lessons: [
                        { id: "hoa-bai-4", name: "Bài 4. Giới thiệu về carbohydrate. Glucose và fructose" },
                        { id: "hoa-bai-5", name: "Bài 5. Saccharose và maltose" },
                        { id: "hoa-bai-6", name: "Bài 6. Tinh bột và cellulose" },
                        { id: "hoa-bai-7", name: "Bài 7. Ôn tập chương 2" }
                    ]
                },
                {
                    id: "hoa-chuong-3",
                    name: "Chương 3. Hợp chất chứa nitrogen",
                    lessons: [
                        { id: "hoa-bai-8", name: "Bài 8. Amine" },
                        { id: "hoa-bai-9", name: "Bài 9. Amino acid và peptide" },
                        { id: "hoa-bai-10", name: "Bài 10. Protein và enzyme" },
                        { id: "hoa-bai-11", name: "Bài 11. Ôn tập chương 3" }
                    ]
                },
                {
                    id: "hoa-chuong-4",
                    name: "Chương 4. Polymer",
                    lessons: [
                        { id: "hoa-bai-12", name: "Bài 12. Đại cương về polymer" },
                        { id: "hoa-bai-13", name: "Bài 13. Vật liệu polymer" },
                        { id: "hoa-bai-14", name: "Bài 14. Ôn tập chương 4" }
                    ]
                }
            ]
        },

        {
            id: "cong-nghe",
            name: "Công nghệ nông nghiệp",
            icon: "🌱",
            color: "#65A30D",
            textbook: "Công nghệ 12 - Lâm nghiệp, Thủy sản",
            chapters: [

                {
                    id: "cn-chuong-1",
                    name: "Chương I. Giới thiệu chung về lâm nghiệp",
                    lessons: [
                        { id: "cn-bai-1", name: "Bài 1. Vai trò và triển vọng của lâm nghiệp" },
                        { id: "cn-bai-2", name: "Bài 2. Các hoạt động lâm nghiệp cơ bản và nguyên nhân chủ yếu làm suy thoái tài nguyên rừng" }
                    ]
                },

                {
                    id: "cn-chuong-2",
                    name: "Chương II. Trồng và chăm sóc rừng",
                    lessons: [
                        { id: "cn-bai-3", name: "Bài 3. Vai trò, nhiệm vụ của trồng và chăm sóc rừng" },
                        { id: "cn-bai-4", name: "Bài 4. Quy luật sinh trưởng và phát triển của cây rừng" },
                        { id: "cn-bai-5", name: "Bài 5. Kĩ thuật trồng và chăm sóc rừng" }
                    ]
                },

                {
                    id: "cn-chuong-3",
                    name: "Chương III. Bảo vệ và khai thác tài nguyên rừng bền vững",
                    lessons: [
                        { id: "cn-bai-6", name: "Bài 6. Ý nghĩa, nhiệm vụ, thực trạng của việc bảo vệ và khai thác rừng" },
                        { id: "cn-bai-7", name: "Bài 7. Biện pháp bảo vệ và khai thác tài nguyên rừng" }
                    ]
                },

                {
                    id: "cn-chuong-4",
                    name: "Chương IV. Giới thiệu chung về thủy sản",
                    lessons: [
                        { id: "cn-bai-8", name: "Bài 8. Vai trò và triển vọng của thủy sản" },
                        { id: "cn-bai-9", name: "Bài 9. Các nhóm thủy sản và một số phương thức nuôi phổ biến" }
                    ]
                },

                {
                    id: "cn-chuong-5",
                    name: "Chương V. Môi trường nuôi thủy sản",
                    lessons: [
                        { id: "cn-bai-10", name: "Bài 10. Giới thiệu về môi trường nuôi thủy sản" },
                        { id: "cn-bai-11", name: "Bài 11. Quản lí môi trường nuôi thủy sản" },
                        { id: "cn-bai-12", name: "Bài 12. Biện pháp xử lí môi trường nuôi thủy sản" }
                    ]
                },

                {
                    id: "cn-chuong-6",
                    name: "Chương VI. Công nghệ giống thủy sản",
                    lessons: [
                        { id: "cn-bai-13", name: "Bài 13. Vai trò của giống thủy sản" },
                        { id: "cn-bai-14", name: "Bài 14. Sinh sản của cá và tôm" },
                        { id: "cn-bai-15", name: "Bài 15. Ứng dụng công nghệ sinh học trong chọn và nhân giống thủy sản" }
                    ]
                },

                {
                    id: "cn-chuong-7",
                    name: "Chương VII. Công nghệ thức ăn thủy sản",
                    lessons: [
                        { id: "cn-bai-16", name: "Bài 16. Thức ăn thủy sản" },
                        { id: "cn-bai-17", name: "Bài 17. Phương pháp bảo quản và chế biến thức ăn thủy sản" },
                        { id: "cn-bai-18", name: "Bài 18. Ứng dụng công nghệ sinh học trong bảo quản, chế biến thức ăn thủy sản" }
                    ]
                },

                {
                    id: "cn-chuong-8",
                    name: "Chương VIII. Công nghệ nuôi thủy sản",
                    lessons: [
                        { id: "cn-bai-19", name: "Bài 19. Công nghệ nuôi một số loài thủy sản phổ biến ở Việt Nam" },
                        { id: "cn-bai-20", name: "Bài 20. Nuôi thủy sản theo tiêu chuẩn VietGAP" },
                        { id: "cn-bai-21", name: "Bài 21. Một số ứng dụng công nghệ cao trong nuôi thủy sản" },
                        { id: "cn-bai-22", name: "Bài 22. Bảo quản và chế biến sản phẩm thủy sản" }
                    ]
                },

                {
                    id: "cn-chuong-9",
                    name: "Chương IX. Phòng, trị bệnh thủy sản",
                    lessons: [
                        { id: "cn-bai-23", name: "Bài 23. Vai trò của phòng, trị bệnh thủy sản" },
                        { id: "cn-bai-24", name: "Bài 24. Một số bệnh thủy sản phổ biến và biện pháp phòng trị" },
                        { id: "cn-bai-25", name: "Bài 25. Ứng dụng công nghệ sinh học trong phòng, trị bệnh thủy sản" }
                    ]
                },

                {
                    id: "cn-chuong-10",
                    name: "Chương X. Bảo vệ và khai thác nguồn lợi thủy sản",
                    lessons: [
                        { id: "cn-bai-26", name: "Bài 26. Bảo vệ nguồn lợi thủy sản" },
                        { id: "cn-bai-27", name: "Bài 27. Khai thác nguồn lợi thủy sản" }
                    ]
                }
            ]
        },

        {
            id: "lich-su",
            name: "Lịch sử",
            icon: "🏛️",
            color: "#D97706",
            textbook: "Lịch sử 12 - Kết nối tri thức",
            chapters: []
        },

        {
            id: "tin",
            name: "Tin học",
            icon: "💻",
            color: "#0891B2",
            textbook: "Tin học 12 - Định hướng Tin học ứng dụng",
            chapters: []
        }
    ]
};

// Cho phép các file JavaScript khác sử dụng dữ liệu
window.STUDY_DATA = STUDY_DATA;
