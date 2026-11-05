
(function () {
    "use strict";

    function makeLessons(prefix, rows) {
        return rows.map(function (row) {
            return {
                id: prefix + "-bai-" + row[0],
                number: row[0],
                title: row[1],
                content: {
                    summary: "",
                    keyPoints: [],
                    formulas: [],
                    tips: [],
                    examples: [],
                    selfCheck: []
                }
            };
        });
    }

    const STUDY_DATA = {
        settings: {
            websiteName: "Kiến thức thập cẩm",
            slogan: "Học dễ hiểu – Nhớ lâu – Thi hiệu quả",
            grade: 12,
            textbook: "Kết nối tri thức với cuộc sống",
            academicYearNote: "Mục lục được tổ chức theo sách giáo khoa đã chọn. Nội dung tóm tắt, mẹo học và ví dụ sẽ được biên soạn bổ sung theo từng bài."
        },

        subjects: [
            {
                id: "toan",
                name: "Toán học",
                icon: "📐",
                color: "#2563eb",
                textbook: "Toán 12 – Tập 1 và Tập 2",
                unitLabel: "Chương",
                description: "Hệ thống kiến thức, công thức và dạng bài Toán 12 theo từng chương.",
                chapters: [
                    {
                        id: "toan-chuong-1", title: "Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số", volume: "Tập 1",
                        lessons: makeLessons("toan", [
                            [1, "Tính đơn điệu và cực trị của hàm số"],
                            [2, "Giá trị lớn nhất và giá trị nhỏ nhất của hàm số"],
                            [3, "Đường tiệm cận của đồ thị hàm số"],
                            [4, "Khảo sát sự biến thiên và vẽ đồ thị của hàm số"],
                            [5, "Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn"]
                        ])
                    },
                    {
                        id: "toan-chuong-2", title: "Chương II. Vectơ và hệ trục tọa độ trong không gian", volume: "Tập 1",
                        lessons: makeLessons("toan", [
                            [6, "Vectơ trong không gian"],
                            [7, "Hệ trục tọa độ trong không gian"],
                            [8, "Biểu thức tọa độ của các phép toán vectơ"]
                        ])
                    },
                    {
                        id: "toan-chuong-3", title: "Chương III. Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm", volume: "Tập 1",
                        lessons: makeLessons("toan", [
                            [9, "Khoảng biến thiên và khoảng tứ phân vị"],
                            [10, "Phương sai và độ lệch chuẩn"]
                        ])
                    },
                    {
                        id: "toan-chuong-4", title: "Chương IV. Nguyên hàm và tích phân", volume: "Tập 2",
                        lessons: makeLessons("toan", [
                            [11, "Nguyên hàm"],
                            [12, "Tích phân"],
                            [13, "Ứng dụng hình học của tích phân"]
                        ])
                    },
                    {
                        id: "toan-chuong-5", title: "Chương V. Phương pháp tọa độ trong không gian", volume: "Tập 2",
                        lessons: makeLessons("toan", [
                            [14, "Phương trình mặt phẳng"],
                            [15, "Phương trình đường thẳng trong không gian"],
                            [16, "Công thức tính góc trong không gian"],
                            [17, "Phương trình mặt cầu"]
                        ])
                    },
                    {
                        id: "toan-chuong-6", title: "Chương VI. Xác suất có điều kiện", volume: "Tập 2",
                        lessons: makeLessons("toan", [
                            [18, "Xác suất có điều kiện"],
                            [19, "Công thức xác suất toàn phần và công thức Bayes"]
                        ])
                    }
                ]
            },

            {
                id: "sinh",
                name: "Sinh học",
                icon: "🧬",
                color: "#15803d",
                textbook: "Sinh học 12",
                unitLabel: "Chương",
                description: "Di truyền học, tiến hóa, sinh thái học và môi trường.",
                chapters: [
                    {
                        id: "sinh-chuong-1", title: "Phần bốn. Di truyền học – Chương I. Di truyền phân tử",
                        lessons: makeLessons("sinh", [
                            [1, "DNA và cơ chế tái bản DNA"],
                            [2, "Gene, quá trình truyền đạt thông tin di truyền và hệ gene"],
                            [3, "Điều hòa biểu hiện gene"],
                            [4, "Đột biến gene"],
                            [5, "Công nghệ di truyền"],
                            [6, "Thực hành: Tách chiết DNA"]
                        ])
                    },
                    {
                        id: "sinh-chuong-2", title: "Phần bốn. Di truyền học – Chương II. Di truyền nhiễm sắc thể",
                        lessons: makeLessons("sinh", [
                            [7, "Cấu trúc và chức năng của nhiễm sắc thể"],
                            [8, "Học thuyết di truyền của Mendel"],
                            [9, "Mở rộng học thuyết Mendel"],
                            [10, "Di truyền giới tính và di truyền liên kết với giới tính"],
                            [11, "Liên kết gene và hoán vị gene"],
                            [12, "Đột biến nhiễm sắc thể"],
                            [13, "Di truyền học người và di truyền y học"],
                            [14, "Thực hành: Quan sát một số dạng đột biến nhiễm sắc thể"]
                        ])
                    },
                    {
                        id: "sinh-chuong-3", title: "Phần bốn. Di truyền học – Chương III. Mở rộng học thuyết di truyền nhiễm sắc thể",
                        lessons: makeLessons("sinh", [
                            [15, "Di truyền gene ngoài nhân"],
                            [16, "Tương tác giữa kiểu gene với môi trường và thành tựu chọn giống"],
                            [17, "Thực hành: Thí nghiệm về thường biến ở cây trồng"]
                        ])
                    },
                    {
                        id: "sinh-chuong-4", title: "Phần bốn. Di truyền học – Chương IV. Di truyền quần thể",
                        lessons: makeLessons("sinh", [
                            [18, "Di truyền học quần thể"]
                        ])
                    },
                    {
                        id: "sinh-chuong-5", title: "Phần năm. Tiến hóa – Chương V. Bằng chứng và các học thuyết tiến hóa",
                        lessons: makeLessons("sinh", [
                            [19, "Các bằng chứng tiến hóa"],
                            [20, "Quan niệm của Darwin về chọn lọc tự nhiên và hình thành loài"],
                            [21, "Học thuyết tiến hóa tổng hợp hiện đại"],
                            [22, "Tiến hóa lớn và quá trình phát sinh chủng loại"]
                        ])
                    },
                    {
                        id: "sinh-chuong-6", title: "Phần sáu. Sinh thái học và môi trường – Chương VI. Môi trường và sinh thái học quần thể",
                        lessons: makeLessons("sinh", [
                            [23, "Môi trường và các nhân tố sinh thái"],
                            [24, "Sinh thái học quần thể"],
                            [25, "Thực hành: Xác định một số đặc trưng của quần thể"]
                        ])
                    },
                    {
                        id: "sinh-chuong-7", title: "Phần sáu. Sinh thái học và môi trường – Chương VII. Sinh thái học quần xã",
                        lessons: makeLessons("sinh", [
                            [26, "Quần xã sinh vật"],
                            [27, "Thực hành: Tìm hiểu cấu trúc dinh dưỡng của quần xã"],
                            [28, "Hệ sinh thái"],
                            [29, "Trao đổi vật chất và chuyển hóa năng lượng trong hệ sinh thái"],
                            [30, "Diễn thế sinh thái"],
                            [31, "Sinh quyển, khu sinh học và chu trình sinh địa hóa"],
                            [32, "Thực hành: Thiết kế một hệ sinh thái nhân tạo"]
                        ])
                    },
                    {
                        id: "sinh-chuong-8", title: "Phần sáu. Sinh thái học và môi trường – Chương VIII. Sinh thái học phục hồi, bảo tồn và phát triển bền vững",
                        lessons: makeLessons("sinh", [
                            [33, "Sinh thái học phục hồi và bảo tồn đa dạng sinh vật"],
                            [34, "Phát triển bền vững"],
                            [35, "Dự án: Tìm hiểu thực trạng bảo tồn hệ sinh thái tại địa phương và đề xuất giải pháp bảo tồn"]
                        ])
                    }
                ]
            },

            {
                id: "hoa",
                name: "Hóa học",
                icon: "🧪",
                color: "#7c3aed",
                textbook: "Hóa học 12",
                unitLabel: "Chương",
                description: "Hóa hữu cơ, điện hóa, kim loại và phức chất.",
                chapters: [
                    {
                        id: "hoa-chuong-1", title: "Chương 1. Ester – Lipid",
                        lessons: makeLessons("hoa", [
                            [1, "Ester – Lipid"],
                            [2, "Xà phòng và chất giặt rửa"],
                            [3, "Ôn tập chương 1"]
                        ])
                    },
                    {
                        id: "hoa-chuong-2", title: "Chương 2. Carbohydrate",
                        lessons: makeLessons("hoa", [
                            [4, "Giới thiệu về carbohydrate. Glucose và fructose"],
                            [5, "Saccharose và maltose"],
                            [6, "Tinh bột và cellulose"],
                            [7, "Ôn tập chương 2"]
                        ])
                    },
                    {
                        id: "hoa-chuong-3", title: "Chương 3. Hợp chất chứa nitrogen",
                        lessons: makeLessons("hoa", [
                            [8, "Amine"],
                            [9, "Amino acid và peptide"],
                            [10, "Protein và enzyme"],
                            [11, "Ôn tập chương 3"]
                        ])
                    },
                    {
                        id: "hoa-chuong-4", title: "Chương 4. Polymer",
                        lessons: makeLessons("hoa", [
                            [12, "Đại cương về polymer"],
                            [13, "Vật liệu polymer"],
                            [14, "Ôn tập chương 4"]
                        ])
                    },
                    {
                        id: "hoa-chuong-5", title: "Chương 5. Pin điện và điện phân",
                        lessons: makeLessons("hoa", [
                            [15, "Thế điện cực và nguồn điện hóa học"],
                            [16, "Điện phân"],
                            [17, "Ôn tập chương 5"]
                        ])
                    },
                    {
                        id: "hoa-chuong-6", title: "Chương 6. Đại cương về kim loại",
                        lessons: makeLessons("hoa", [
                            [18, "Cấu tạo và liên kết trong tinh thể kim loại"],
                            [19, "Tính chất vật lí và tính chất hóa học của kim loại"],
                            [20, "Kim loại trong tự nhiên và phương pháp tách kim loại"],
                            [21, "Hợp kim"],
                            [22, "Sự ăn mòn kim loại"],
                            [23, "Ôn tập chương 6"]
                        ])
                    },
                    {
                        id: "hoa-chuong-7", title: "Chương 7. Nguyên tố nhóm IA và nhóm IIA",
                        lessons: makeLessons("hoa", [
                            [24, "Nguyên tố nhóm IA"],
                            [25, "Nguyên tố nhóm IIA"],
                            [26, "Ôn tập chương 7"]
                        ])
                    },
                    {
                        id: "hoa-chuong-8", title: "Chương 8. Sơ lược về dãy kim loại chuyển tiếp thứ nhất và phức chất",
                        lessons: makeLessons("hoa", [
                            [27, "Đại cương về kim loại chuyển tiếp dãy thứ nhất"],
                            [28, "Sơ lược về phức chất"],
                            [29, "Một số tính chất và ứng dụng của phức chất"],
                            [30, "Ôn tập chương 8"]
                        ])
                    }
                ]
            },

            {
                id: "cong-nghe",
                name: "Công nghệ nông nghiệp",
                icon: "🌱",
                color: "#65a30d",
                textbook: "Công nghệ 12 – Lâm nghiệp, Thủy sản",
                unitLabel: "Chương",
                description: "Kiến thức lâm nghiệp, thủy sản, môi trường nuôi và bảo vệ nguồn lợi.",
                chapters: [
                    {
                        id: "cn-chuong-1", title: "Chương I. Giới thiệu chung về lâm nghiệp",
                        lessons: makeLessons("cn", [
                            [1, "Vai trò và triển vọng của lâm nghiệp"],
                            [2, "Các hoạt động lâm nghiệp cơ bản và nguyên nhân chủ yếu làm suy thoái tài nguyên rừng"]
                        ])
                    },
                    {
                        id: "cn-chuong-2", title: "Chương II. Trồng và chăm sóc rừng",
                        lessons: makeLessons("cn", [
                            [3, "Vai trò, nhiệm vụ của trồng và chăm sóc rừng"],
                            [4, "Quy luật sinh trưởng và phát triển của cây rừng"],
                            [5, "Kĩ thuật trồng và chăm sóc rừng"]
                        ])
                    },
                    {
                        id: "cn-chuong-3", title: "Chương III. Bảo vệ và khai thác tài nguyên rừng bền vững",
                        lessons: makeLessons("cn", [
                            [6, "Ý nghĩa, nhiệm vụ, thực trạng của việc bảo vệ và khai thác rừng"],
                            [7, "Biện pháp bảo vệ và khai thác tài nguyên rừng"]
                        ])
                    },
                    {
                        id: "cn-chuong-4", title: "Chương IV. Giới thiệu chung về thủy sản",
                        lessons: makeLessons("cn", [
                            [8, "Vai trò và triển vọng của thủy sản"],
                            [9, "Các nhóm thủy sản và một số phương thức nuôi phổ biến"]
                        ])
                    },
                    {
                        id: "cn-chuong-5", title: "Chương V. Môi trường nuôi thủy sản",
                        lessons: makeLessons("cn", [
                            [10, "Giới thiệu về môi trường nuôi thủy sản"],
                            [11, "Quản lí môi trường nuôi thủy sản"],
                            [12, "Biện pháp xử lí môi trường nuôi thủy sản"]
                        ])
                    },
                    {
                        id: "cn-chuong-6", title: "Chương VI. Công nghệ giống thủy sản",
                        lessons: makeLessons("cn", [
                            [13, "Vai trò của giống thủy sản"],
                            [14, "Sinh sản của cá và tôm"],
                            [15, "Ứng dụng công nghệ sinh học trong chọn và nhân giống thủy sản"]
                        ])
                    },
                    {
                        id: "cn-chuong-7", title: "Chương VII. Công nghệ thức ăn thủy sản",
                        lessons: makeLessons("cn", [
                            [16, "Thức ăn thủy sản"],
                            [17, "Phương pháp bảo quản và chế biến thức ăn thủy sản"],
                            [18, "Ứng dụng công nghệ sinh học trong bảo quản, chế biến thức ăn thủy sản"]
                        ])
                    },
                    {
                        id: "cn-chuong-8", title: "Chương VIII. Công nghệ nuôi thủy sản",
                        lessons: makeLessons("cn", [
                            [19, "Công nghệ nuôi một số loài thủy sản phổ biến ở Việt Nam"],
                            [20, "Nuôi thủy sản theo tiêu chuẩn VietGAP"],
                            [21, "Một số ứng dụng công nghệ cao trong nuôi thủy sản"],
                            [22, "Bảo quản và chế biến sản phẩm thủy sản"]
                        ])
                    },
                    {
                        id: "cn-chuong-9", title: "Chương IX. Phòng, trị bệnh thủy sản",
                        lessons: makeLessons("cn", [
                            [23, "Vai trò của phòng, trị bệnh thủy sản"],
                            [24, "Một số bệnh thủy sản phổ biến và biện pháp phòng trị"],
                            [25, "Ứng dụng công nghệ sinh học trong phòng, trị bệnh thủy sản"]
                        ])
                    },
                    {
                        id: "cn-chuong-10", title: "Chương X. Bảo vệ và khai thác nguồn lợi thủy sản",
                        lessons: makeLessons("cn", [
                            [26, "Bảo vệ nguồn lợi thủy sản"],
                            [27, "Khai thác nguồn lợi thủy sản"]
                        ])
                    }
                ]
            },

            {
                id: "lich-su",
                name: "Lịch sử",
                icon: "🏛️",
                color: "#b45309",
                textbook: "Lịch sử 12",
                unitLabel: "Chủ đề",
                description: "Lịch sử thế giới hiện đại, ASEAN, Việt Nam và Hồ Chí Minh.",
                chapters: [
                    {
                        id: "ls-chude-1", title: "Chủ đề 1. Thế giới trong và sau Chiến tranh lạnh",
                        lessons: makeLessons("ls", [
                            [1, "Liên hợp quốc"],
                            [2, "Trật tự thế giới trong Chiến tranh lạnh"],
                            [3, "Trật tự thế giới sau Chiến tranh lạnh"]
                        ])
                    },
                    {
                        id: "ls-chude-2", title: "Chủ đề 2. ASEAN: Những chặng đường lịch sử",
                        lessons: makeLessons("ls", [
                            [4, "Sự ra đời và phát triển của Hiệp hội các quốc gia Đông Nam Á (ASEAN)"],
                            [5, "Cộng đồng ASEAN: Từ ý tưởng đến hiện thực"]
                        ])
                    },
                    {
                        id: "ls-chude-3", title: "Chủ đề 3. Cách mạng tháng Tám năm 1945, chiến tranh giải phóng dân tộc và chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam (từ tháng 8 năm 1945 đến nay)",
                        lessons: makeLessons("ls", [
                            [6, "Cách mạng tháng Tám năm 1945"],
                            [7, "Cuộc kháng chiến chống thực dân Pháp (1945–1954)"],
                            [8, "Cuộc kháng chiến chống Mỹ, cứu nước (1954–1975)"],
                            [9, "Cuộc đấu tranh bảo vệ Tổ quốc từ sau tháng 4–1975 đến nay. Một số bài học lịch sử của các cuộc kháng chiến bảo vệ Tổ quốc từ năm 1945 đến nay"]
                        ])
                    },
                    {
                        id: "ls-chude-4", title: "Chủ đề 4. Công cuộc Đổi mới ở Việt Nam từ năm 1986 đến nay",
                        lessons: makeLessons("ls", [
                            [10, "Khái quát về công cuộc Đổi mới từ năm 1986 đến nay"],
                            [11, "Thành tựu cơ bản và bài học của công cuộc Đổi mới ở Việt Nam từ năm 1986 đến nay"]
                        ])
                    },
                    {
                        id: "ls-chude-5", title: "Chủ đề 5. Lịch sử đối ngoại của Việt Nam thời cận – hiện đại",
                        lessons: makeLessons("ls", [
                            [12, "Hoạt động đối ngoại của Việt Nam trong đấu tranh giành độc lập dân tộc (từ đầu thế kỉ XX đến Cách mạng tháng Tám năm 1945)"],
                            [13, "Hoạt động đối ngoại của Việt Nam trong kháng chiến chống Pháp (1945–1954) và kháng chiến chống Mỹ (1954–1975)"],
                            [14, "Hoạt động đối ngoại của Việt Nam từ năm 1975 đến nay"]
                        ])
                    },
                    {
                        id: "ls-chude-6", title: "Chủ đề 6. Hồ Chí Minh trong lịch sử Việt Nam",
                        lessons: makeLessons("ls", [
                            [15, "Khái quát cuộc đời và sự nghiệp của Hồ Chí Minh"],
                            [16, "Hồ Chí Minh – Anh hùng giải phóng dân tộc"],
                            [17, "Dấu ấn Hồ Chí Minh trong lòng nhân dân thế giới và Việt Nam"]
                        ])
                    }
                ]
            },

            {
                id: "tin",
                name: "Tin học",
                icon: "💻",
                color: "#0e7490",
                textbook: "Tin học 12 – Định hướng Tin học ứng dụng",
                unitLabel: "Chủ đề",
                description: "Trí tuệ nhân tạo, mạng máy tính, HTML, CSS và ứng dụng tin học.",
                chapters: [
                    {
                        id: "tin-chude-1", title: "Chủ đề 1. Máy tính và xã hội tri thức",
                        lessons: makeLessons("tin", [
                            [1, "Làm quen với trí tuệ nhân tạo"],
                            [2, "Trí tuệ nhân tạo trong khoa học và đời sống"]
                        ])
                    },
                    {
                        id: "tin-chude-2", title: "Chủ đề 2. Mạng máy tính và Internet",
                        lessons: makeLessons("tin", [
                            [3, "Một số thiết bị mạng thông dụng"],
                            [4, "Giao thức mạng"],
                            [5, "Thực hành chia sẻ tài nguyên trên mạng"]
                        ])
                    },
                    {
                        id: "tin-chude-3", title: "Chủ đề 3. Đạo đức, pháp luật và văn hóa trong môi trường số",
                        lessons: makeLessons("tin", [
                            [6, "Giao tiếp và ứng xử trong không gian mạng"]
                        ])
                    },
                    {
                        id: "tin-chude-4", title: "Chủ đề 4. Giải quyết vấn đề với sự trợ giúp của máy tính",
                        lessons: makeLessons("tin", [
                            [7, "HTML và cấu trúc trang web"],
                            [8, "Định dạng văn bản"],
                            [9, "Tạo danh sách, bảng"],
                            [10, "Tạo liên kết"],
                            [11, "Chèn tệp tin đa phương tiện và khung nội tuyến vào trang web"],
                            [12, "Tạo biểu mẫu"],
                            [13, "Khái niệm, vai trò của CSS"],
                            [14, "Định dạng văn bản bằng CSS"],
                            [15, "Tạo màu cho chữ và nền"],
                            [16, "Định dạng khung"],
                            [17, "Các mức ưu tiên của bộ chọn"],
                            [18, "Thực hành tổng hợp thiết kế trang web"]
                        ])
                    },
                    {
                        id: "tin-chude-5", title: "Chủ đề 5. Hướng nghiệp với tin học",
                        lessons: makeLessons("tin", [
                            [19, "Dịch vụ sửa chữa và bảo trì máy tính"],
                            [20, "Nhóm nghề quản trị thuộc ngành Công nghệ thông tin"],
                            [21, "Hội thảo hướng nghiệp"]
                        ])
                    },
                    {
                        id: "tin-chude-6", title: "Chủ đề 6. Máy tính và xã hội tri thức",
                        lessons: makeLessons("tin", [
                            [22, "Thực hành kết nối các thiết bị số"]
                        ])
                    },
                    {
                        id: "tin-chude-7", title: "Chủ đề 7. Ứng dụng tin học",
                        lessons: makeLessons("tin", [
                            [23, "Chuẩn bị xây dựng trang web"],
                            [24, "Xây dựng phần đầu trang web"],
                            [25, "Xây dựng phần thân và chân trang web"],
                            [26, "Liên kết và thanh điều hướng"],
                            [27, "Biểu mẫu trên trang web"],
                            [28, "Thực hành tổng hợp"]
                        ])
                    }
                ]
            }
        ]
    };

    window.STUDY_DATA = STUDY_DATA;
}());
----- KET THUC NOI DUNG data.js -----

   
                           
