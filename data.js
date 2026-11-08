
(function () {
    "use strict";

    // Notes below are independently written study aids. They are deliberately
    // marked unverified until checked against the exact 2026 textbook edition.
    const LESSON_NOTES = {
      'toan-1': {summary:'Dùng đạo hàm để xét tính đơn điệu và tìm cực trị của hàm số trên tập xác định hoặc một khoảng xác định.',keyPoints:['Tìm tập xác định trước khi xét đạo hàm.','Tính đạo hàm và tìm các điểm làm đạo hàm bằng 0 hoặc không xác định.','Lập bảng xét dấu đạo hàm; suy ra khoảng đồng biến, nghịch biến.','Điểm cực trị phải được kết luận qua sự đổi dấu của đạo hàm (hoặc tiêu chuẩn tương đương được học).'],formulas:['f′(x) > 0 trên khoảng ⇒ f đồng biến trên khoảng đó.','f′(x) < 0 trên khoảng ⇒ f nghịch biến trên khoảng đó.'],tips:['Phân biệt điểm tới hạn với điểm cực trị: không phải mọi nghiệm f′(x)=0 đều là cực trị.','Ghi rõ các khoảng bằng ký hiệu khoảng, không chỉ liệt kê dấu.'],examples:['Với f(x)=x³−3x, f′(x)=3x²−3=3(x−1)(x+1). Xét dấu f′ tại các khoảng để kết luận chiều biến thiên và cực trị.'],selfCheck:['Điều kiện nào cho phép kết luận hàm số đồng biến?','Vì sao f′(a)=0 chưa đủ để kết luận x=a là điểm cực trị?']},
      'toan-2': {summary:'Tìm giá trị lớn nhất, giá trị nhỏ nhất bằng cách xét hàm số trên đúng miền xác định; với đoạn kín, kiểm tra cả điểm tới hạn và hai đầu mút.',keyPoints:['Xác định miền cần tìm GTLN, GTNN và kiểm tra tính liên tục trên miền đó.','Trên đoạn [a;b], tính đạo hàm, tìm điểm tới hạn thuộc (a;b).','Tính giá trị hàm tại các điểm tới hạn và hai đầu mút rồi so sánh.','Trên khoảng không đóng, cần xét giới hạn và khả năng đạt giá trị.'],formulas:['Trên [a;b], so sánh f(a), f(b) và f(c) với c là các điểm tới hạn trong (a;b).'],tips:['Không bỏ sót hai đầu mút khi bài toán cho đoạn.','Phân biệt “giá trị lớn nhất” (phải đạt được) với “cận trên đúng”.'],examples:['Với f(x)=x² trên [-1;2], so sánh f(-1)=1, f(0)=0, f(2)=4 ⇒ GTNN=0, GTLN=4.'],selfCheck:['Khi nào cần xét cả hai đầu mút?','Nếu hàm không đạt cận trên thì có GTLN không?']},
      'toan-3': {summary:'Nhận biết và xác định tiệm cận đứng, tiệm cận ngang hoặc tiệm cận xiên thông qua giới hạn của hàm số.',keyPoints:['Tiệm cận đứng x=a liên quan đến giới hạn vô cực khi x tiến tới a.','Tiệm cận ngang y=L khi giới hạn của f(x) tại +∞ hoặc −∞ bằng L hữu hạn.','Tiệm cận xiên y=ax+b được xác định khi f(x)−(ax+b) tiến về 0; thường tìm a và b bằng giới hạn.','Một đồ thị có thể có nhiều tiệm cận ở các phía khác nhau.'],formulas:['lim(x→a⁺)f(x)=±∞ hoặc lim(x→a⁻)f(x)=±∞ ⇒ x=a là TCĐ.','lim(x→±∞)f(x)=L ⇒ y=L là TCN.','a=lim(x→∞) f(x)/x; b=lim(x→∞)[f(x)−ax] (khi các giới hạn tồn tại hữu hạn).'],tips:['Với phân thức, không kết luận tiệm cận đứng chỉ từ mẫu bằng 0: cần xét rút gọn và giới hạn.','Kiểm tra riêng +∞ và −∞.'],examples:['f(x)=(2x+1)/(x−3) có tiệm cận đứng x=3 và tiệm cận ngang y=2.'],selfCheck:['Điều kiện giới hạn nào tạo ra tiệm cận ngang?','Vì sao phải xét giới hạn sau khi rút gọn phân thức?']},
      'toan-4': {summary:'Quy trình khảo sát hàm số gồm tập xác định, đạo hàm, chiều biến thiên, cực trị, giới hạn, tiệm cận (nếu có) và phác họa đồ thị.',keyPoints:['Xác định tập xác định.','Tính đạo hàm, giải f′(x)=0 và xét dấu.','Lập bảng biến thiên, tính các giới hạn cần thiết.','Xác định giao điểm với trục tọa độ và các tiệm cận; chọn điểm đặc trưng để vẽ.'],formulas:['Điểm giao trục hoành: giải f(x)=0.','Điểm giao trục tung (nếu 0 thuộc tập xác định): (0;f(0)).'],tips:['Bảng biến thiên phải nhất quán với dấu đạo hàm và giới hạn.','Không vẽ đồ thị trước khi xác định tiệm cận và các điểm cực trị.'],examples:['Với hàm phân thức bậc nhất trên bậc nhất, kiểm tra mẫu bằng 0, đạo hàm và hai giới hạn vô cực trước khi phác họa.'],selfCheck:['Nêu thứ tự các bước khảo sát hàm số.','Đồ thị có thể cắt tiệm cận ngang không?']},
      'toan-5': {summary:'Mô hình hóa bài toán thực tiễn bằng hàm số, xác định đại lượng cần tối ưu và miền giá trị phù hợp rồi dùng công cụ đạo hàm hoặc GTLN–GTNN.',keyPoints:['Chọn biến và nêu rõ ý nghĩa, đơn vị.','Biểu diễn đại lượng cần tối ưu theo biến.','Xác định điều kiện thực tế để lập miền xác định.','Tìm và kiểm tra nghiệm tối ưu trong miền hợp lệ; diễn giải kết quả bằng ngữ cảnh.'],formulas:['Quy trình: mô hình hóa → xác định miền → tối ưu hàm → kiểm tra → kết luận có đơn vị.'],tips:['Nghiệm toán học ngoài miền thực tế phải loại.','Kiểm tra kết quả có hợp lý về đơn vị và độ lớn.'],examples:['Nếu chi phí C(x) phụ thuộc sản lượng x, chỉ tối ưu trên miền sản lượng khả thi x≥0 và các giới hạn công suất.'],selfCheck:['Vì sao phải nêu miền giá trị của biến?','Kết quả tối ưu cần được diễn giải như thế nào?']},
      'toan-6': {summary:'Vectơ trong không gian được xác định bởi hướng và độ dài; các phép toán vectơ tuân theo quy tắc hình học và tính chất đại số.',keyPoints:['Vectơ-không có độ dài bằng 0; hai vectơ bằng nhau khi cùng hướng và cùng độ dài.','Tổng vectơ tuân theo quy tắc ba điểm hoặc hình bình hành.','Hiệu vectơ được hiểu là cộng với vectơ đối.','Tích vectơ với số thực làm thay đổi độ dài và có thể đổi hướng.'],formulas:['AB⃗ + BC⃗ = AC⃗.','AB⃗ = −BA⃗.'],tips:['Phân biệt điểm A với vectơ AB⃗.','Khi biến đổi, giữ nguyên thứ tự điểm ở ký hiệu vectơ.'],examples:['Theo quy tắc ba điểm: AB⃗+BC⃗=AC⃗.'],selfCheck:['Khi nào hai vectơ được gọi là bằng nhau?','Vectơ đối của vectơ u⃗ là gì?']},
      'toan-7': {summary:'Hệ trục tọa độ Oxyz gắn mỗi điểm trong không gian với bộ ba tọa độ thực; các trục đôi một vuông góc và có chung gốc O.',keyPoints:['Điểm M có tọa độ (x;y;z), tương ứng các hình chiếu theo ba trục.','Các vectơ đơn vị i⃗, j⃗, k⃗ lần lượt theo Ox, Oy, Oz.','Khoảng cách và trung điểm được tính từ tọa độ theo từng thành phần.'],formulas:['OM⃗ = x i⃗ + y j⃗ + z k⃗.','AB = √[(xB−xA)²+(yB−yA)²+(zB−zA)²].','Trung điểm I: ((xA+xB)/2;(yA+yB)/2;(zA+zB)/2).'],tips:['Viết đúng thứ tự (x;y;z), không hoán đổi trục.','Vẽ phác trục Oxyz để kiểm tra dấu tọa độ.'],examples:['A(1;2;3), B(3;0;5) ⇒ AB=√(4+4+4)=2√3.'],selfCheck:['Tọa độ điểm có mấy thành phần?','Công thức khoảng cách trong không gian khác gì trong mặt phẳng?']},
      'toan-8': {summary:'Biểu diễn các phép toán vectơ bằng tọa độ trong hệ trục Oxyz, thực hiện phép cộng, trừ, nhân với số và tích vô hướng theo từng thành phần.',keyPoints:['Cộng và trừ vectơ theo từng tọa độ tương ứng.','Nhân vectơ với số thực: nhân từng thành phần.','Tích vô hướng liên hệ với góc giữa hai vectơ.'],formulas:['Nếu u⃗=(a1;a2;a3), v⃗=(b1;b2;b3): u⃗+v⃗=(a1+b1;a2+b2;a3+b3).','u⃗·v⃗=a1b1+a2b2+a3b3.','cos(u⃗,v⃗)=(u⃗·v⃗)/(|u⃗||v⃗|), với hai vectơ khác vectơ-không.'],tips:['Tích vô hướng cho kết quả là số, không phải vectơ.','Kiểm tra phép tính theo từng tọa độ.'],examples:['(1;2;−1)·(2;0;3)=2+0−3=−1.'],selfCheck:['Tích vô hướng của hai vectơ vuông góc bằng bao nhiêu?','Khi nào không xác định góc theo công thức cos?']},
      'toan-9': {summary:'Khoảng biến thiên và khoảng tứ phân vị mô tả độ phân tán của dữ liệu; khoảng tứ phân vị ít bị ảnh hưởng bởi các giá trị ngoại lệ hơn khoảng biến thiên.',keyPoints:['Khoảng biến thiên bằng giá trị lớn nhất trừ giá trị nhỏ nhất.','Khoảng tứ phân vị IQR=Q3−Q1.','Với số liệu ghép nhóm, các tứ phân vị được ước lượng theo lớp chứa tứ phân vị.','Cần xác định đúng vị trí Q1, Q2, Q3 theo quy ước đang học.'],formulas:['R = xmax − xmin.','IQR = Q3 − Q1.'],tips:['Không nhầm khoảng tứ phân vị với độ lệch chuẩn.','Nêu rõ đây là giá trị tính từ mẫu số liệu hay ước lượng từ bảng ghép nhóm.'],examples:['Dữ liệu có Q1=12 và Q3=20 thì IQR=8.'],selfCheck:['Đại lượng nào nhạy hơn với giá trị cực đoan?','IQR được tính từ những tứ phân vị nào?']},
      'toan-10': {summary:'Phương sai và độ lệch chuẩn đo mức độ phân tán của dữ liệu quanh giá trị trung bình; độ lệch chuẩn có cùng đơn vị với dữ liệu.',keyPoints:['Tính số trung bình trước.','Phương sai là trung bình cộng của bình phương độ lệch so với số trung bình (theo công thức của mẫu đang xét).','Độ lệch chuẩn là căn bậc hai không âm của phương sai.','Độ phân tán càng lớn thì dữ liệu càng trải rộng quanh trung bình.'],formulas:['s² = (1/n)Σ(xi−x̄)² (đối với dãy số liệu theo công thức mô tả tổng thể dữ liệu).','s = √s².'],tips:['Không lấy căn trước khi tính xong phương sai.','Chú ý công thức cho số liệu ghép nhóm có dùng giá trị đại diện từng lớp.'],examples:['Nếu phương sai bằng 9 thì độ lệch chuẩn bằng 3 (đơn vị dữ liệu).'],selfCheck:['Độ lệch chuẩn có đơn vị gì?','Vì sao phương sai không âm?']},
      'toan-11': {summary:'Nguyên hàm của f trên một khoảng là hàm F có đạo hàm bằng f trên khoảng đó; hai nguyên hàm bất kỳ chỉ khác nhau một hằng số.',keyPoints:['Kiểm tra bằng cách lấy đạo hàm kết quả.','Cộng hằng số tùy ý C vào họ nguyên hàm.','Sử dụng tính tuyến tính và bảng nguyên hàm cơ bản.'],formulas:['∫f(x)dx = F(x)+C, nếu F′(x)=f(x).','∫xⁿdx=xⁿ⁺¹/(n+1)+C (n≠−1).','∫1/x dx=ln|x|+C.'],tips:['Luôn thêm +C với nguyên hàm bất định.','Đạo hàm ngược là cách kiểm tra nhanh nhất.'],examples:['∫3x²dx=x³+C vì (x³+C)′=3x².'],selfCheck:['Vì sao phải có hằng số C?','Nguyên hàm của 1/x có điều kiện gì về miền xác định?']},
      'toan-12': {summary:'Tích phân xác định biểu diễn giới hạn của tổng diện tích đại số và có thể tính bằng nguyên hàm theo công thức Newton–Leibniz.',keyPoints:['Phân biệt tích phân xác định với nguyên hàm bất định.','Nếu F′=f liên tục trên [a;b], tích phân bằng F(b)−F(a).','Đổi cận phải giữ đúng thứ tự; đảo cận làm đổi dấu.'],formulas:['∫ₐᵇ f(x)dx = F(b)−F(a).','∫ₐᵇ f(x)dx = −∫ᵇₐ f(x)dx.'],tips:['Tìm nguyên hàm rồi thế cận trên trừ cận dưới.','Không tự ý lấy giá trị tuyệt đối của tích phân.'],examples:['∫₀² 2x dx = [x²]₀² = 4.'],selfCheck:['Đổi thứ tự hai cận thì tích phân thay đổi thế nào?','Tích phân xác định có phải luôn là diện tích hình phẳng không?']},
      'toan-13': {summary:'Dùng tích phân để tính diện tích hình phẳng và thể tích một số khối; cần xác định đúng miền hình học và biểu thức dưới dấu tích phân.',keyPoints:['Diện tích giữa đồ thị và trục Ox cần xét dấu hàm hoặc chia khoảng tại giao điểm.','Diện tích giữa hai đồ thị được tính từ hiệu hàm trên–dưới.','Thể tích khối tròn xoay dùng công thức phù hợp với trục quay và miền.'],formulas:['S=∫ₐᵇ |f(x)|dx.','Nếu f(x)≥g(x) trên [a;b], S=∫ₐᵇ[f(x)−g(x)]dx.'],tips:['Vẽ phác hình trước khi lập tích phân.','Không quên chia khoảng khi hai đồ thị đổi vị trí.'],examples:['Trên [0;1], diện tích dưới y=x là ∫₀¹x dx=1/2.'],selfCheck:['Khi nào phải dùng dấu giá trị tuyệt đối?','Cách chọn hàm trên và hàm dưới?']},
      'toan-14': {summary:'Phương trình mặt phẳng được xác định bởi một điểm thuộc mặt phẳng và vectơ pháp tuyến khác vectơ-không.',keyPoints:['Vectơ pháp tuyến vuông góc với mọi vectơ chỉ phương nằm trong mặt phẳng.','Thay tọa độ điểm đã biết vào phương trình để xác định hệ số tự do.','Hai mặt phẳng song song khi các vectơ pháp tuyến cùng phương.'],formulas:['Qua M0(x0;y0;z0), pháp tuyến n⃗=(A;B;C): A(x−x0)+B(y−y0)+C(z−z0)=0.','Dạng tổng quát: Ax+By+Cz+D=0.'],tips:['Không nhầm vectơ pháp tuyến mặt phẳng với vectơ chỉ phương đường thẳng.','Kiểm tra điểm thuộc mặt phẳng bằng cách thay tọa độ vào.'],examples:['Mặt phẳng qua (1;0;2), n⃗=(2;−1;3): 2(x−1)−y+3(z−2)=0.'],selfCheck:['Vectơ nào vuông góc với mặt phẳng?','Điều kiện để hai mặt phẳng song song?']},
      'toan-15': {summary:'Đường thẳng trong không gian có thể biểu diễn bằng một điểm và vectơ chỉ phương; phương trình tham số cho tọa độ điểm theo tham số.',keyPoints:['Vectơ chỉ phương song song với đường thẳng.','Điểm thuộc đường thẳng khi tồn tại tham số thỏa cả ba phương trình.','Xét vị trí tương đối bằng quan hệ vectơ chỉ phương và hệ phương trình.'],formulas:['Qua M0(x0;y0;z0), u⃗=(a;b;c): x=x0+at, y=y0+bt, z=z0+ct.'],tips:['Một vectơ chỉ phương không duy nhất; mọi bội khác 0 đều dùng được.','Không chia cho thành phần bằng 0 khi viết dạng chính tắc.'],examples:['Qua (1;2;0), u⃗=(2;−1;3): x=1+2t, y=2−t, z=3t.'],selfCheck:['Điều kiện để điểm thuộc đường thẳng?','Đường thẳng có thể có bao nhiêu vectơ chỉ phương?']},
      'toan-16': {summary:'Góc trong không gian được tính thông qua góc giữa các vectơ thích hợp; cần chú ý góc giữa hai đường thẳng được quy về góc nhọn hoặc vuông.',keyPoints:['Góc giữa hai đường thẳng lấy góc không vượt quá 90° theo quy ước phổ thông.','Góc giữa đường thẳng và mặt phẳng liên hệ với hình chiếu vuông góc.','Góc giữa hai mặt phẳng là góc giữa hai đường thẳng lần lượt vuông góc với giao tuyến và nằm trong mỗi mặt phẳng.'],formulas:['cosθ=(u⃗·v⃗)/(|u⃗||v⃗|) cho góc giữa hai vectơ khác 0.'],tips:['Chọn vectơ chỉ phương/pháp tuyến đúng đối tượng.','Kiểm tra góc cần lấy là góc nhọn hay góc tù theo định nghĩa.'],examples:['Với u⃗=(1;0;0), v⃗=(0;1;0), tích vô hướng bằng 0 nên hai vectơ vuông góc.'],selfCheck:['Cách xác định góc giữa hai mặt phẳng?','Vì sao phải chú ý quy ước góc giữa hai đường thẳng?']},
      'toan-17': {summary:'Phương trình mặt cầu được xác định bởi tâm và bán kính; dạng khai triển cho phép nhận biết tâm và bán kính bằng cách hoàn thành bình phương.',keyPoints:['Tâm I(a;b;c), bán kính R>0.','Điểm thuộc mặt cầu khi khoảng cách đến tâm bằng R.','Trong dạng khai triển, hệ số các bình phương x²,y²,z² bằng nhau và không có tích chéo.'],formulas:['(x−a)²+(y−b)²+(z−c)²=R².','x²+y²+z²+Ax+By+Cz+D=0; I(−A/2;−B/2;−C/2), R²=(A²+B²+C²)/4−D.'],tips:['Sau khi hoàn thành bình phương, kiểm tra R²>0 để có mặt cầu thực.','Không nhầm bán kính R với R².'],examples:['x²+y²+z²−2x+4y−6z−2=0 ⇒ tâm (1;−2;3), R=4.'],selfCheck:['Điều kiện nào để phương trình biểu diễn mặt cầu thực?','Cách tìm tâm từ dạng khai triển?']},
      'toan-18': {summary:'Xác suất có điều kiện là xác suất của biến cố A khi biết biến cố B đã xảy ra, với điều kiện P(B)>0.',keyPoints:['Không gian mẫu được thu hẹp theo điều kiện B.','Phân biệt P(A|B) với P(B|A).','Nếu A và B độc lập thì P(A|B)=P(A), khi P(B)>0.'],formulas:['P(A|B)=P(A∩B)/P(B), P(B)>0.'],tips:['Đọc câu “biết rằng B” để xác định biến cố điều kiện nằm sau dấu |.','Vẽ sơ đồ cây hoặc bảng hai chiều khi dữ liệu nhiều nhánh.'],examples:['Trong hộp có 3 bi đỏ, 2 bi xanh; lấy một bi. Biết bi lấy ra không xanh thì xác suất nó đỏ bằng 1.'],selfCheck:['Điều kiện để P(A|B) xác định?','P(A|B) có luôn bằng P(B|A) không?']},
      'toan-19': {summary:'Công thức xác suất toàn phần phân rã xác suất theo một hệ đầy đủ biến cố; công thức Bayes đảo chiều điều kiện để cập nhật xác suất nguyên nhân khi biết kết quả.',keyPoints:['B1,…,Bn đôi một xung khắc và tạo thành hệ đầy đủ; P(Bi)>0.','Tính P(A) bằng tổng P(Bi)P(A|Bi).','Bayes dùng P(Bk|A) để suy ra xác suất nguồn/nhóm Bk sau khi quan sát A.'],formulas:['P(A)=ΣP(Bi)P(A|Bi).','P(Bk|A)=P(Bk)P(A|Bk)/P(A), P(A)>0.'],tips:['Xác định rõ “nguyên nhân” Bi và “kết quả quan sát” A trước khi thay số.','Kiểm tra tổng xác suất các nhánh bằng 1.'],examples:['Nếu hai máy tạo lần lượt 60% và 40% sản phẩm, biết tỉ lệ lỗi từng máy, xác suất sản phẩm lỗi là tổng có trọng số theo tỉ lệ sản lượng.'],selfCheck:['Điều kiện để dùng công thức xác suất toàn phần?','Bayes khác xác suất có điều kiện thông thường ở mục đích nào?']},
      'tin-7': {summary:'HTML là ngôn ngữ đánh dấu dùng để mô tả cấu trúc và ý nghĩa nội dung trang web; trình duyệt phân tích các phần tử HTML để hiển thị.',keyPoints:['Tài liệu HTML thường có DOCTYPE, html, head và body.','Phần tử thường gồm thẻ mở, nội dung và thẻ đóng; một số phần tử rỗng.','Dùng tiêu đề, đoạn văn, danh sách và phần tử ngữ nghĩa phù hợp.'],formulas:['<!doctype html> · <html lang="vi"> · <head>…</head> · <body>…</body>'],tips:['Thụt lề nhất quán để dễ phát hiện thẻ chưa đóng.','Dùng phần tử đúng ngữ nghĩa thay vì chọn thẻ chỉ vì kiểu hiển thị.'],examples:['<h1>Tiêu đề</h1><p>Đây là một đoạn văn.</p>'],selfCheck:['HTML dùng để mô tả cấu trúc hay tạo kiểu?','Vai trò của head và body?']},
      'tin-8': {summary:'Các phần tử HTML định dạng nội dung văn bản theo cấu trúc và ý nghĩa; CSS thường được ưu tiên để kiểm soát trình bày trực quan.',keyPoints:['Dùng h1–h6 cho các cấp tiêu đề.','Dùng p cho đoạn văn; strong và em thể hiện mức nhấn mạnh ngữ nghĩa.','Không lạm dụng phần tử trình bày lỗi thời.'],formulas:['<h1>…</h1> · <p>…</p> · <strong>…</strong> · <em>…</em>'],tips:['Mỗi trang nên có cấu trúc tiêu đề logic, không chọn cấp tiêu đề chỉ vì kích thước chữ.','Tách nội dung và cách trình bày.'],examples:['<p>Học <strong>đều đặn</strong> giúp ghi nhớ tốt hơn.</p>'],selfCheck:['Khi nào dùng strong thay vì chỉ in đậm bằng CSS?','Tiêu đề h2 có nên xuất hiện trước h1 không?']},
      'tin-9': {summary:'HTML hỗ trợ danh sách có thứ tự, không thứ tự và bảng dữ liệu; bảng chỉ nên dùng cho dữ liệu dạng hàng–cột.',keyPoints:['ul tạo danh sách không thứ tự; ol tạo danh sách có thứ tự; li là mục danh sách.','table chứa tr; tiêu đề cột dùng th; ô dữ liệu dùng td.','Dùng caption và thead/tbody khi phù hợp.'],formulas:['<ul><li>…</li></ul> · <ol><li>…</li></ol> · <table><tr><th>…</th></tr></table>'],tips:['Không dùng bảng để dàn bố cục trang.','Mỗi hàng bảng cần số ô phù hợp cấu trúc dữ liệu.'],examples:['<ol><li>Bước một</li><li>Bước hai</li></ol>'],selfCheck:['Khác nhau giữa ul và ol?','Th và td có vai trò gì?']},
      'tin-10': {summary:'Liên kết HTML dùng phần tử a với thuộc tính href để dẫn đến trang, tệp, vị trí trong trang hoặc địa chỉ phù hợp.',keyPoints:['href xác định đích liên kết.','Liên kết tương đối phụ thuộc vị trí tệp; liên kết tuyệt đối chứa địa chỉ đầy đủ.','Văn bản liên kết nên mô tả rõ đích đến.'],formulas:['<a href="https://example.com">Tên liên kết</a>'],tips:['Kiểm tra đường dẫn và chữ hoa–thường của tên tệp khi triển khai trên máy chủ Linux.','Không dùng “bấm vào đây” làm nhãn duy nhất nếu có thể mô tả cụ thể.'],examples:['<a href="about.html">Giới thiệu</a>'],selfCheck:['href có chức năng gì?','Khi nào nên dùng đường dẫn tương đối?']},
      'tin-11': {summary:'HTML có thể nhúng hình ảnh, âm thanh, video và nội dung từ tài liệu khác; cần mô tả thay thế và thiết lập thuộc tính phù hợp.',keyPoints:['img dùng src và alt; alt mô tả ý nghĩa ảnh khi ảnh không hiển thị.','audio và video hỗ trợ phát nội dung đa phương tiện.','iframe nhúng một trang hoặc tài nguyên khác; cần cân nhắc bảo mật và khả năng truy cập.'],formulas:['<img src="anh.jpg" alt="Mô tả ảnh">'],tips:['Không bỏ trống alt với ảnh mang thông tin; ảnh trang trí có thể dùng alt rỗng.','Tối ưu dung lượng ảnh và dùng định dạng phù hợp.'],examples:['<img src="logo.png" alt="Logo câu lạc bộ">'],selfCheck:['Tại sao ảnh cần alt?','iframe có phải lúc nào cũng nên dùng không?']},
      'tin-12': {summary:'Biểu mẫu HTML thu thập dữ liệu người dùng thông qua các điều khiển như input, label, select, textarea và button.',keyPoints:['form bao quanh các trường nhập liệu.','label liên kết với điều khiển qua for và id.','name là tên trường dữ liệu gửi đi; type xác định kiểu điều khiển.','required hỗ trợ kiểm tra trường bắt buộc ở phía trình duyệt.'],formulas:['<label for="email">Email</label><input id="email" name="email" type="email">'],tips:['Không dùng placeholder thay cho label.','Kiểm tra dữ liệu cả phía máy chủ; xác thực HTML không thay thế bảo mật.'],examples:['<input type="number" min="0" max="10" name="score">'],selfCheck:['Khác nhau giữa id và name?','Vì sao không nên chỉ dựa vào kiểm tra phía trình duyệt?']},
      'tin-13': {summary:'CSS là ngôn ngữ mô tả cách trình bày phần tử HTML, giúp tách nội dung khỏi giao diện và tái sử dụng quy tắc định dạng.',keyPoints:['Quy tắc CSS gồm bộ chọn và khối khai báo.','Khai báo gồm thuộc tính và giá trị.','CSS có thể viết nội tuyến, trong phần style hoặc tệp ngoài.'],formulas:['selector { property: value; }','Ví dụ: p { color: navy; }'],tips:['Ưu tiên tệp CSS ngoài để dễ bảo trì nhiều trang.','Kiểm tra dấu ; và dấu ngoặc nhọn khi không thấy kiểu áp dụng.'],examples:['.notice { padding: 12px; border: 1px solid #ccc; }'],selfCheck:['Một quy tắc CSS gồm những phần nào?','Lợi ích của CSS ngoài?']},
      'tin-14': {summary:'CSS định dạng văn bản bằng các thuộc tính như font-family, font-size, font-weight, line-height, text-align và text-decoration.',keyPoints:['Chọn phông chữ dự phòng phù hợp.','Dùng đơn vị kích thước hợp lý và chú ý khả năng đọc.','Line-height ảnh hưởng khoảng cách dòng.'],formulas:['p { font-size: 1rem; line-height: 1.6; text-align: left; }'],tips:['Không dùng cỡ chữ quá nhỏ trên điện thoại.','Giữ độ tương phản chữ–nền đủ rõ.'],examples:['h1 { font-weight: 700; letter-spacing: .02em; }'],selfCheck:['Thuộc tính nào điều chỉnh khoảng cách dòng?','text-align có các giá trị thường gặp nào?']},
      'tin-15': {summary:'CSS thiết lập màu chữ và màu nền bằng tên màu, mã hex, rgb/rgba và các cách biểu diễn màu hợp lệ.',keyPoints:['color đặt màu chữ; background-color đặt màu nền.','Mã hex dạng #RRGGBB biểu diễn ba thành phần đỏ, lục, lam.','Độ tương phản ảnh hưởng khả năng đọc và khả năng tiếp cận.'],formulas:['color: #173b67; background-color: #ffffff;'],tips:['Không chỉ dùng màu để truyền đạt trạng thái; bổ sung chữ hoặc biểu tượng.','Kiểm tra tương phản khi dùng chữ nhạt trên nền sáng.'],examples:['.card { color: #172033; background-color: #f4f7fb; }'],selfCheck:['Thuộc tính nào đặt màu chữ?','Vì sao cần kiểm tra độ tương phản?']},
      'tin-16': {summary:'Mô hình hộp CSS mô tả kích thước phần tử qua content, padding, border và margin.',keyPoints:['Content là vùng nội dung.','Padding là khoảng đệm bên trong đường viền.','Border là đường viền; margin là khoảng cách bên ngoài.','box-sizing:border-box giúp width/height bao gồm padding và border.'],formulas:['Kích thước ngoài mặc định = content + padding + border (theo từng chiều), không tính margin.'],tips:['Dùng * { box-sizing: border-box; } để tính kích thước dễ hơn.','Margin có thể gộp trong một số ngữ cảnh bố cục.'],examples:['.box { width: 240px; padding: 16px; border: 2px solid; box-sizing: border-box; }'],selfCheck:['Phân biệt padding và margin?','box-sizing:border-box thay đổi cách tính width thế nào?']},
      'tin-17': {summary:'Mức ưu tiên CSS quyết định khai báo nào được áp dụng khi nhiều quy tắc cùng tác động đến một phần tử.',keyPoints:['Nguồn khai báo, !important, độ đặc hiệu và thứ tự xuất hiện đều có vai trò.','ID thường có độ đặc hiệu cao hơn class; class cao hơn selector phần tử.','Kế thừa không mạnh hơn khai báo trực tiếp phù hợp.'],formulas:['Thứ tự khái quát: !important → độ đặc hiệu → thứ tự nguồn (khi các yếu tố trước hòa).'],tips:['Tránh lạm dụng !important vì khó bảo trì.','Dùng công cụ kiểm tra kiểu tính toán để tìm quy tắc thắng.'],examples:['#main p thường ưu tiên hơn .card p do có bộ chọn ID.'],selfCheck:['Bộ chọn ID và class, loại nào có độ đặc hiệu cao hơn?','Khi nào thứ tự xuất hiện quyết định kết quả?']}
    };

    function makeLessons(prefix, rows) {
        return rows.map(function (row) {
            const note = LESSON_NOTES[prefix + '-' + row[0]] || null;
            return {
                id: prefix + '-bai-' + row[0],
                number: row[0],
                title: row[1],
                content: note ? Object.assign({verified: false, source: 'Ghi chú tham khảo do biên soạn độc lập; cần đối chiếu với đúng bản SGK Kết nối tri thức 2026 trước khi xem là nội dung chuẩn.'}, note) : {
                    summary: '', keyPoints: [], formulas: [], tips: [], examples: [], selfCheck: [], verified: false,
                    source: 'Chưa biên soạn và đối chiếu với đúng bản SGK Kết nối tri thức 2026.'
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
            academicYearNote: "Định hướng SGK Kết nối tri thức với cuộc sống từ năm học 2026–2027. Nội dung ghi chú tham khảo phải được đối chiếu với bản SGK hiện hành trước khi xác nhận.",
            officialTextbookDecision: "3588/QĐ-BGDĐT ngày 26/12/2025",
            officialTextbookUrl: "https://xaydungchinhsach.chinhphu.vn/quyet-dinh-so-3588-qd-bgddt-ve-bo-sach-giao-khoa-giao-duc-pho-thong-su-dung-thong-nhat-toan-quoc-119251227145448874.htm",
            textbookUpdatesUrl: "https://taphuan.nxbgd.vn"
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
                name: "Công nghệ (Lâm nghiệp – Thủy sản)",
                icon: "🌱",
                color: "#65a30d",
                textbook: "Công nghệ 12 – Lâm nghiệp, Thủy sản",
                unitLabel: "Chương",
                description: "Kiến thức theo định hướng Lâm nghiệp – Thủy sản: trồng, chăm sóc, bảo vệ rừng và nuôi trồng thủy sản.",
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

   
                           
