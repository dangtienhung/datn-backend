const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['vi'] }); //
//
const axios = require('axios');



//AFFSS11K câu hỏi 1 
manager.addDocument('vi','Làm thế nào để tạo một đơn hàng trà sữa cơ bản?','AFFSS11K');
manager.addDocument('vi',"Có thể tạo một đơn hàng trà sữa như thế nào?",'AFFSS11K');
manager.addDocument('vi',"Làm sao để mua trà sữa?",'AFFSS11K');
manager.addDocument('vi',"Có cách nào để đặt một ly trà sữa không?",'AFFSS11K');
manager.addDocument('vi',"Làm thế nào để đặt một đơn hàng trà sữa?",'AFFSS11K');
manager.addDocument('vi',"Có thể đặt một ly trà sữa như thế nào?",'AFFSS11K');
manager.addDocument('vi',"Cách để mua trà sữa?",'AFFSS11K');
manager.addDocument('vi',"Có thể đặt một ly trà sữa như thế nào?",'AFFSS11K');
manager.addDocument('vi',"Có cách nào để tạo một đơn hàng trà sữa đơn giản không?",'AFFSS11K');
//Ans
manager.addAnswer('vi','AFFSS11K',"Bạn có thể sử dụng tài khoản đăng nhập của mình để tạo đơn hàng trà sữa.");
manager.addAnswer('vi','AFFSS11K',"Điền thông tin đầy đủ, bao gồm số điện thoại và địa chỉ, vào biểu mẫu để tạo đơn hàng trà sữa một cách nhanh chóng.");
manager.addAnswer('vi','AFFSS11K',"Sử dụng tính năng đăng nhập để tạo đơn hàng trà sữa một cách thuận tiện.");
manager.addAnswer('vi','AFFSS11K',"Điền đầy đủ thông tin cá nhân, bao gồm số điện thoại và địa chỉ, để tạo đơn hàng trà sữa một cách nhanh nhất.");
manager.addAnswer('vi','AFFSS11K',"Bạn có thể đăng nhập vào tài khoản của mình và sử dụng tính năng tạo đơn hàng để đặt trà sữa.");
manager.addAnswer('vi','AFFSS11K',"Điền thông tin cá nhân, bao gồm số điện thoại và địa chỉ, vào biểu mẫu để tạo đơn hàng trà sữa một cách tiện lợi.");
manager.addAnswer('vi','AFFSS11K',"Sử dụng chức năng đăng nhập và điền đầy đủ thông tin cá nhân để tạo đơn hàng trà sữa.");
manager.addAnswer('vi','AFFSS11K',"Đăng nhập vào tài khoản của bạn và thực hiện việc tạo đơn hàng trà sữa bằng cách điền đầy đủ thông tin cá nhân.");
manager.addAnswer('vi','AFFSS11K',"Bạn có thể đăng nhập vào tài khoản của mình và sử dụng tính năng tạo đơn hàng để đặt trà sữa một cách dễ dàng.");
manager.addAnswer('vi','AFFSS11K',"Điền đầy đủ thông tin cá nhân, bao gồm số điện thoại và địa chỉ, để tạo đơn hàng trà sữa một cách nhanh chóng và thuận tiện nhất.");



//BFFSS2k mã định danh model cho câu hỏi 2
manager.addDocument('vi','Có bao nhiêu loại trà sữa phổ biến mà tôi có thể chọn?','BFFSS2k');
manager.addDocument('vi',"Tôi có thể chọn từ mấy loại trà sữa phổ biến?",'BFFSS2k');
manager.addDocument('vi',"Có những loại trà sữa nào được coi là phổ biến và tôi có thể chọn?",'BFFSS2k');
manager.addDocument('vi',"Tôi muốn biết về các loại trà sữa phổ biến mà tôi có thể chọn, có thể giúp tôi không?",'BFFSS2k');
manager.addDocument('vi',"Trà sữa có những loại nào là phổ biến và tôi có thể chọn?",'BFFSS2k');
axios.get('http://localhost:3000/products')
.then((response) => {
     let AllProduct = "<span style='display:flex'>";
     for(let i = 0 ;i<response['data'].length ;i++){
          if(i==5)break;
          let value=response['data'][i];
          AllProduct +=
          "<div style='width:100px;color:green;border:1px #ccc solid;margin:10px'>" +
          value.name +
          "<img style='width:100px;height:100px' src=" +
          value.images[0].url +'></div> ';
     }
     manager.addAnswer('vi', 'BFFSS2k', 'Shop có 5 món này phổ biến nè ' + AllProduct);
     manager.addAnswer('vi', 'BFFSS2k', 'Shop có mấy món này phổ biến này ' + AllProduct);
     manager.save();
     manager.train();

})


//CSSSS3K
manager.addDocument('vi','Làm thế nào để tôi thêm một loại trà sữa vào đơn hàng?','CSSSS3K');
manager.addDocument('vi',"Tôi cần làm gì để thêm một loại trà sữa vào đơn hàng của mình?",'CSSSS3K');
manager.addDocument('vi',"Làm thế nào để tôi có thể thêm một loại trà sữa vào đơn hàng tôi đang tạo?",'CSSSS3K');
manager.addDocument('vi',"Có cách nào để tôi thêm một loại trà sữa vào đơn hàng không?",'CSSSS3K');
manager.addDocument('vi',"Tôi cần phải làm gì để thêm một loại trà sữa vào đơn hàng tôi đang đặt?",'CSSSS3K');
manager.addDocument('vi',"Bạn có thể cho tôi biết cách để thêm một loại trà sữa vào đơn hàng tôi đang tạo không?",'CSSSS3K');
//Ans
manager.addAnswer('vi','CSSSS3K',"Bạn có thể đăng nhập vào tài khoản và tạo đơn hàng hoặc điền đầy đủ thông tin bao gồm số điện thoại và địa chỉ để tạo nhanh chóng nhất.");
manager.addAnswer('vi','CSSSS3K',"Để tạo đơn hàng nhanh nhất, bạn có thể đăng nhập hoặc điền đầy đủ thông tin cá nhân, bao gồm số điện thoại và địa chỉ.");
manager.addAnswer('vi','CSSSS3K',"Để tạo đơn hàng một cách nhanh chóng, bạn có thể lựa chọn đăng nhập hoặc điền đầy đủ thông tin bao gồm số điện thoại và địa chỉ");
manager.addAnswer('vi','CSSSS3K',"Để tạo đơn hàng một cách thuận tiện và nhanh nhất, bạn có thể đăng nhập vào tài khoản hoặc điền đầy đủ thông tin cá nhân, bao gồm số điện thoại và địa chỉ.");
manager.addAnswer('vi','CSSSS3K',"Để tạo đơn hàng một cách hiệu quả và nhanh chóng, bạn có thể lựa chọn đăng nhập hoặc điền đầy đủ thông tin bao gồm số điện thoại và địa chỉ");



//DFSSS3k
manager.addDocument('vi','Làm thế nào để thêm topping vào đơn hàng trà sữa?','DFSSS3k');
manager.addDocument('vi','Có cách nào để tôi có thể thêm topping vào đơn hàng trà sữa không?','DFSSS3k');
manager.addDocument('vi','Làm sao để tôi có thể bổ sung topping vào đơn hàng trà sữa?','DFSSS3k');
manager.addDocument('vi','Tôi muốn thêm topping vào đơn hàng trà sữa, có cách nào để làm điều đó không?','DFSSS3k');
manager.addDocument('vi','Có phương pháp nào để tôi có thể đặt thêm topping vào đơn hàng trà sữa không?','DFSSS3k');
manager.addDocument('vi','Làm thế nào để tôi có thể yêu cầu thêm topping vào đơn hàng trà sữa?','DFSSS3k');
//Ans
manager.addAnswer('vi','DFSSS3K','Toping bạn có thể tuỳ chọn bằng cách xem qua gian hàng của shop và lựa chọn loại phù hợp theo sở thích và giá tiền');
manager.addAnswer('vi','DFSSS3K','Bạn có thể tùy chọn topping bằng cách xem qua danh sách sản phẩm của shop và chọn loại phù hợp với khẩu vị và giá cả');
manager.addAnswer('vi','DFSSS3K','Để chọn topping, bạn có thể tham khảo danh sách sản phẩm của shop và lựa chọn loại phù hợp với sở thích và ngân sách của bạn.');
manager.addAnswer('vi','DFSSS3K','Topping có thể được lựa chọn bằng cách xem qua các mục hàng của shop và chọn loại phù hợp với sở thích cá nhân và giá cả.');
manager.addAnswer('vi','DFSSS3K','Bạn có thể tùy chọn topping bằng cách xem qua gian hàng của shop và chọn loại phù hợp với sở thích và ngân sách của bạn.');
manager.addAnswer('vi','DFSSS3K','Để thêm topping, bạn có thể xem qua danh sách sản phẩm của shop và lựa chọn loại phù hợp với khẩu vị và giá tiền.');




//FFSS4F
manager.addDocument('vi','Có phí vận chuyển cho đơn hàng không? Nếu có, làm thế nào để tính phí vận chuyển?','FFSS4F');
manager.addDocument('vi','Cho đơn hàng có tính phí vận chuyển không? Nếu có, làm thế nào để tính phí vận chuyển?','FFSS4F');
manager.addDocument('vi','Đơn hàng có phải trả phí vận chuyển không? Nếu có, cách tính phí vận chuyển như thế nào?','FFSS4F');
manager.addDocument('vi','Có mất phí vận chuyển cho đơn hàng không? Nếu có, làm sao để tính phí vận chuyển?','FFSS4F');
manager.addDocument('vi','Đơn hàng có chi phí vận chuyển không? Nếu có, làm thế nào để tính toán phí vận chuyển?','FFSS4F');
manager.addDocument('vi','Có phải trả phí vận chuyển cho đơn hàng không? Nếu có, cách tính phí vận chuyển ra sao?','FFSS4F');
//Ans
manager.addAnswer('vi','FFSS4F','Dạ có phí vận chuyển nhé , phí sẽ tuỳ do thời gian đặt hàng , thời tiết và các yếu tố bên ship , phí sẽ dựa trên số Kilomet của quá trình vận chuyển.');
manager.addAnswer('vi','FFSS4F','Có phí vận chuyển, phụ thuộc vào thời gian đặt hàng, thời tiết và các yếu tố khác từ bên giao hàng, phí sẽ dựa trên số km di chuyển.');
manager.addAnswer('vi','FFSS4F','Vận chuyển có phí, phụ thuộc vào thời gian đặt hàng, thời tiết và các yếu tố từ bên vận chuyển, phí tính theo số km di chuyển.');
manager.addAnswer('vi','FFSS4F','Có phí vận chuyển, phụ thuộc vào thời gian đặt hàng, thời tiết và các yếu tố từ bên giao hàng, phí sẽ được tính dựa trên quãng đường vận chuyển.');
manager.addAnswer('vi','FFSS4F','Trong quá trình vận chuyển sẽ có phí, phụ thuộc vào thời gian đặt hàng, thời tiết và các yếu tố từ bên ship, phí sẽ được tính dựa trên số km di chuyển.');
manager.addAnswer('vi','FFSS4F','Có phí vận chuyển, phụ thuộc vào thời gian đặt hàng, thời tiết và các yếu tố từ bên ship, phí sẽ được tính dựa trên quãng đường vận chuyển.');




//HFFSS4K
manager.addDocument('vi','Làm thế nào để chỉnh sửa một đơn hàng đã được đặt?','HFFSS4K');
//Ans
manager.addAnswer('vi','HFFSS4K','Rất tiếc hệ thống sẽ không cho chỉnh sửa đơn hàng');
manager.addAnswer('vi','HFFSS4K','Hiện tại hệ thống sẽ không cho phép chỉnh sửa đơn hàng sau khi bạn đã đặt hàng ! Trân Trọng .');




//IFFSS5K
manager.addDocument('vi','Làm thế nào để xóa một sản phẩm khỏi đơn hàng?','IFFSS5K');
manager.addDocument('vi','Có cách nào để loại bỏ một sản phẩm khỏi đơn hàng không?','IFFSS5K');
manager.addDocument('vi','Làm sao để xoá đi một sản phẩm trong đơn hàng?','IFFSS5K');
manager.addDocument('vi','Có thể xóa một sản phẩm khỏi đơn hàng như thế nào?','IFFSS5K');
manager.addDocument('vi','Làm thế nào để bỏ đi một sản phẩm trong đơn hàng?','IFFSS5K');
manager.addDocument('vi','Có cách nào để xoá bỏ một sản phẩm trong đơn hàng không?','IFFSS5K');

//Ans
manager.addAnswer('vi','IFFSS5K','bạn có thể xoá bằng cách vào đơn hàng của tôi và chọn xoá');
manager.addAnswer('vi','IFFSS5K','Bạn có thể xoá sản phẩm bằng cách truy cập vào đơn hàng của bạn và chọn tùy chọn xoá.');
manager.addAnswer('vi','IFFSS5K','Để xoá một sản phẩm, bạn có thể vào đơn hàng của mình và chọn lựa chọn xoá.');
manager.addAnswer('vi','IFFSS5K','Việc xoá một sản phẩm khỏi đơn hàng có thể được thực hiện bằng cách vào đơn hàng và chọn xoá.');
manager.addAnswer('vi','IFFSS5K','Để xoá một sản phẩm, hãy truy cập vào đơn hàng của bạn và lựa chọn xoá.');
manager.addAnswer('vi','IFFSS5K','Bạn có thể xoá một sản phẩm bằng cách vào đơn hàng của bạn và chọn tùy chọn xoá đi.');





//JHFSS6K
manager.addDocument('vi','Làm thế nào để xác nhận đơn hàng và thực hiện thanh toán?','JHFSS6K');
manager.addDocument('vi','Làm sao để xác nhận đơn hàng và thanh toán?','JHFSS6K');
manager.addDocument('vi','Có cách nào để xác nhận và thanh toán đơn hàng không?','JHFSS6K');
manager.addDocument('vi','Làm thế nào để xác nhận và tiến hành thanh toán cho đơn hàng?','JHFSS6K');
manager.addDocument('vi','Có phương pháp nào để xác nhận và thanh toán đơn hàng không?','JHFSS6K');
manager.addDocument('vi','Làm thế nào để xác nhận và thực hiện thanh toán cho đơn hàng của tôi?','JHFSS6K');

//Ans
manager.addAnswer('vi','JHFSS6K','Bạn có thể xác nhận đơn hàng .');
manager.addAnswer('vi','JHFSS6K','Bạn có thể thực hiện việc xác nhận đơn hàng.');
manager.addAnswer('vi','JHFSS6K','Việc xác nhận đơn hàng có sẽ bao gồm thực hiện thanh toán.');






//KFFSS7O_
manager.addDocument('vi','Làm thế nào để theo dõi tình trạng giao hàng của một đơn hàng?','KFFSS7O_');
manager.addDocument('vi','Làm sao để kiểm tra tình trạng giao hàng của một đơn hàng?','KFFSS7O_');
manager.addDocument('vi','Có cách nào để theo dõi tình trạng giao hàng của một đơn hàng không?','KFFSS7O_');
manager.addDocument('vi','Làm thế nào để biết được tình trạng giao hàng của một đơn hàng?','KFFSS7O_');
manager.addDocument('vi','Có phương pháp nào để xem tình trạng giao hàng của một đơn hàng không?','KFFSS7O_');
manager.addDocument('vi','Làm thế nào để tra cứu tình trạng giao hàng của một đơn hàng?','KFFSS7O_');
//Ans
manager.addAnswer('vi','KFFSS7O_','Bạn có thể vào đơn hàng của tôi để xem tình trạng và chi tiết đơn hàng hoặc điền ID đơn hàng tại đây Chatbot sẽ đưa ra thông tin đơn hàng chính xác');
manager.addAnswer('vi','KFFSS7O_','Bạn có thể truy cập vào đơn hàng của bạn để kiểm tra tình trạng và chi tiết đơn hàng. Hoặc có thể nhập ID đơn hàng tại đây và Chatbot sẽ cung cấp thông tin đơn hàng chính xác.');
manager.addAnswer('vi','KFFSS7O_','Vào đơn hàng của bạn để xem tình trạng và chi tiết đơn hàng. Hoặc nhập ID đơn hàng tại đây và Chatbot sẽ cung cấp thông tin đơn hàng chính xác.');
manager.addAnswer('vi','KFFSS7O_','Để xem tình trạng và chi tiết đơn hàng, hãy truy cập vào đơn hàng của bạn hoặc điền ID đơn hàng tại đây. Chatbot sẽ cung cấp thông tin đơn hàng chính xác.');
manager.addAnswer('vi','KFFSS7O_','Điều bạn cần làm là vào đơn hàng của bạn để kiểm tra tình trạng và chi tiết đơn hàng. Hoặc nhập ID đơn hàng tại đây và Chatbot sẽ đưa ra thông tin đơn hàng chính xác.');
manager.addAnswer('vi','KFFSS7O_','Để xem tình trạng và chi tiết đơn hàng, hãy vào đơn hàng của bạn hoặc điền ID đơn hàng tại đây. Chatbot sẽ cung cấp thông tin đơn hàng chính xác.');








//LFFSS8K
manager.addDocument('vi','Làm thế nào để kiểm tra tồn kho các loại trà sữa và topping?','LFFSS8K');
//Ans
manager.addAnswer('vi','LFFSS8K','[Null]');
//=> WRONG ANSWER :=>error [Answer Not Null]










//MFFSS9K
manager.addDocument('vi','Bạn có hệ thống ưu đãi hoặc phiếu giảm giá không? Làm thế nào để áp dụng chúng cho đơn hàng?','MFFSS9K');
manager.addDocument('vi','Có chương trình ưu đãi hoặc phiếu giảm giá không? Làm thế nào để sử dụng chúng cho đơn hàng?','MFFSS9K');
manager.addDocument('vi','Có khuyến mãi hoặc phiếu giảm giá không? Làm sao để áp dụng chúng cho đơn hàng?','MFFSS9K');
manager.addDocument('vi','Có ưu đãi đặc biệt hoặc phiếu giảm giá không? Làm thế nào để áp dụng chúng cho đơn hàng?','MFFSS9K');
manager.addDocument('vi','Có chính sách ưu đãi hoặc phiếu giảm giá không? Làm cách nào để sử dụng chúng cho đơn hàng?','MFFSS9K');
manager.addDocument('vi','Có chương trình khuyến mãi hoặc phiếu giảm giá không? Làm thế nào để áp dụng chúng cho đơn hàng?','MFFSS9K');
//Ans
manager.addAnswer('vi','MFFSS9K','shop có rất nhiều ưu đãi và vouche khác nhau , sẽ phát rất nhiều vào các dịp lễ và tri ân khách hàng');
manager.addAnswer('vi','MFFSS9K','Có, chúng tôi có rất nhiều ưu đãi và voucher khác nhau trong cửa hàng. Chúng tôi thường phát hành chúng vào các dịp lễ và để tri ân khách hàng.');
manager.addAnswer('vi','MFFSS9K','Chúng tôi có một loạt các ưu đãi và voucher khác nhau trong cửa hàng. Chúng tôi thường cung cấp chúng vào các dịp lễ và để tri ân khách hàng.');
manager.addAnswer('vi','MFFSS9K','Cửa hàng của chúng tôi có nhiều ưu đãi và voucher khác nhau. Chúng tôi thường phát hành chúng vào các dịp lễ và để tri ân khách hàng.');
manager.addAnswer('vi','MFFSS9K','Chúng tôi cung cấp rất nhiều ưu đãi và voucher khác nhau trong cửa hàng. Chúng tôi thường phát hành chúng vào các dịp lễ và để tri ân khách hàng.');
manager.addAnswer('vi','MFFSS9K','Cửa hàng của chúng tôi có rất nhiều ưu đãi và voucher khác nhau. Chúng tôi thường phát hành chúng vào các dịp lễ và để tri ân khách hàng.');









//NFFSS10K
manager.addDocument('vi','Làm thế nào để đặt hàng nhanh cho các sản phẩm trà sữa phổ biến mà khách hàng thường chọn?','NFFSS10K');
manager.addDocument('vi','Cách nhanh nhất để đặt hàng các sản phẩm trà sữa phổ biến mà khách hàng thường chọn là gì?','NFFSS10K');
manager.addDocument('vi','Bạn có thể chỉ cho tôi các phương pháp đặt hàng nhanh cho các sản phẩm trà sữa phổ biến mà khách hàng thường chọn không?','NFFSS10K');
manager.addDocument('vi','Làm sao để đặt hàng nhanh các sản phẩm trà sữa phổ biến mà khách hàng thường chọn?','NFFSS10K');
manager.addDocument('vi','Có những cách nào để đặt hàng nhanh cho các loại trà sữa phổ biến mà khách hàng thường chọn không?','NFFSS10K');
manager.addDocument('vi','Bạn có thể cho tôi biết cách đặt hàng nhanh cho các sản phẩm trà sữa phổ biến mà khách hàng thường chọn được không?','NFFSS10K');

//Ans
manager.addAnswer('vi','NFFSS10K','sản phẩm nổi bật và sản phẩm phổ biến sẽ được hiển thị ở ngay trang chính');
//=> WRONG ANSWER :=>error [Answer Not Similar]









//OFFSS11K
manager.addDocument('vi','Có thể tạo danh sách ưa thích của khách hàng để đặt hàng nhanh hơn không?','OFFSS11K');
//Ans
manager.addAnswer('vi','OFFSS11K','[Null]');
//=> WRONG ANSWER :=>error [Answer Not Null]










//PFFSS12K
manager.addDocument('vi','Làm thế nào để tính toán tổng giá trị của đơn hàng với tất cả các món đã chọn?','PFFSS12K');
//Ans
manager.addAnswer('vi','PFFSS12K','[Null]');
//=> WRONG ANSWER :=>error [Answer Not Null]






//UFSS13K
manager.addDocument('vi','Làm thế nào để thực hiện theo dõi lịch sử đặt hàng của một khách hàng?','UFSS13K');
manager.addDocument('vi','Có cách nào để theo dõi lịch sử đặt hàng của một khách hàng không?','UFSS13K');
manager.addDocument('vi','Làm sao để kiểm tra lịch sử đặt hàng của một khách hàng?','UFSS13K');
manager.addDocument('vi','Có phương pháp nào để xem thông tin về các đơn hàng trước đây của một khách hàng không?','UFSS13K');
manager.addDocument('vi','Làm thế nào để tra cứu lịch sử đặt hàng của một khách hàng?','UFSS13K');
manager.addDocument('vi','Bạn có thể chỉ cho tôi cách xem lịch sử đặt hàng của một khách hàng được không?','UFSS13K');

//Ans
manager.addAnswer('vi','UFSS13K','bạn có thể vào phần lịch sử đơn hàng để theo dõi nha');
manager.addAnswer('vi','UFSS13K','Bạn có thể kiểm tra lịch sử đơn hàng để theo dõi đấy.');
manager.addAnswer('vi','UFSS13K','Vào phần lịch sử đơn hàng để xem thông tin chi tiết về các đơn hàng trước đây.');
manager.addAnswer('vi','UFSS13K','Để theo dõi, bạn có thể truy cập vào phần lịch sử đơn hàng.');
manager.addAnswer('vi','UFSS13K','Để biết thêm, bạn có thể xem lịch sử đơn hàng để theo dõi.');
manager.addAnswer('vi','UFSS13K','Hãy vào phần lịch sử đơn hàng để xem thông tin về các đơn hàng đã được đặt.');





//SRHSS14K
manager.addDocument('vi','Có cách nào để xử lý việc trả lại hoặc hoàn tiền cho một đơn hàng?','SRHSS14K');
manager.addDocument('vi','Có phương pháp nào để xử lý việc trả lại hoặc hoàn tiền cho một đơn hàng không?','SRHSS14K');
manager.addDocument('vi','Làm thế nào để giải quyết việc trả lại hoặc hoàn tiền cho một đơn hàng?','SRHSS14K');
manager.addDocument('vi','Có cách nào để xử lý việc trả lại hoặc nhận hoàn tiền cho một đơn hàng không?','SRHSS14K');
manager.addDocument('vi','Bạn có thể chỉ cho tôi cách xử lý việc trả lại hoặc hoàn tiền cho một đơn hàng được không?','SRHSS14K');
manager.addDocument('vi','Làm sao để xử lý việc trả lại hoặc yêu cầu hoàn tiền cho một đơn hàng?','SRHSS14K');

//Ans
manager.addAnswer('vi','SRHSS14K','nếu như gặp sự cố liên quan đến đơn hàng , bạn hãy tạo ticket chat để được các nhân viên hỗ trợ nhanh nhất nhé');
manager.addAnswer('vi','SRHSS14K','fffNếu bạn gặp bất kỳ vấn đề nào liên quan đến đơn hàng, hãy tạo một ticket chat để được hỗ trợ từ các nhân viên ngay lập tức.fff');
manager.addAnswer('vi','SRHSS14K','Để giải quyết các vấn đề liên quan đến đơn hàng, bạn có thể tạo một ticket chat để được hỗ trợ từ đội ngũ nhân viên chuyên nghiệp.');
manager.addAnswer('vi','SRHSS14K','Trong trường hợp xảy ra sự cố với đơn hàng, hãy tạo một ticket chat để được hỗ trợ nhanh chóng từ các nhân viên.');
manager.addAnswer('vi','SRHSS14K','Nếu bạn gặp vấn đề với đơn hàng, hãy tạo một ticket chat để được các nhân viên hỗ trợ ngay lập tức.');
manager.addAnswer('vi','SRHSS14K','Để xử lý các vấn đề liên quan đến đơn hàng, bạn có thể tạo một ticket chat để nhận được sự hỗ trợ nhanh nhất từ đội ngũ nhân viên.');




//RFHSS15K
manager.addDocument('vi','Làm thế nào để gửi xác nhận đặt hàng và thông tin liên lạc đến khách hàng qua email hoặc tin nhắn văn bản?','RFHSS15K');
//Ans
manager.addAnswer('vi','RFHSS15K','[Null]');
//=> WRONG ANSWER :=>error [Answer Not Null]







//TRHSS16K
manager.addDocument('vi','Bạn cung cấp dịch vụ giao hàng tận nơi không? Làm thế nào để xác định thời gian giao hàng dự kiến?','TRHSS16K');
manager.addDocument('vi','Có cung cấp dịch vụ giao hàng tận nơi không? Làm sao để biết thời gian giao hàng dự kiến?','TRHSS16K');
manager.addDocument('vi','Bạn có dịch vụ giao hàng tận nơi không? Làm thế nào để xác định thời gian giao hàng dự kiến?','TRHSS16K');
manager.addDocument('vi','Dịch vụ giao hàng tận nơi có được cung cấp không? Làm cách nào để xác định thời gian giao hàng dự kiến?','TRHSS16K');
manager.addDocument('vi','Có hỗ trợ giao hàng tận nơi không? Làm thế nào để biết thời gian giao hàng dự kiến?','TRHSS16K');
manager.addDocument('vi','Bạn có dịch vụ giao hàng đến tận nơi không? Làm sao để xác định thời gian giao hàng dự kiến?','TRHSS16K');
//Ans
manager.addAnswer('vi','TRHSS16K','shop có dịch vụ giao hàng tận nơi , và thời gian giao hàng phụ thuộc nhiều yếu tố bao gồm quãng đường , thời tiết ......');
manager.addAnswer('vi','TRHSS16K','Chúng tôi có cung cấp dịch vụ giao hàng tận nơi. Để xác định thời gian giao hàng dự kiến, bạn có thể làm như sau: Kiểm tra thông tin về thời gian giao hàng dự kiến trên trang web của chúng tôi. Liên hệ với chúng tôi qua số điện thoại hoặc chat trực tuyến để được tư vấn về thời gian giao hàng dự kiến.');
manager.addAnswer('vi','TRHSS16K','húng tôi đảm bảo dịch vụ giao hàng tận nơi. Để biết thời gian giao hàng dự kiến, bạn có thể thực hiện các bước sau: Truy cập vào trang web của chúng tôi và tìm thông tin về thời gian giao hàng dự kiến. Liên hệ với chúng tôi qua số điện thoại hoặc email để được hỗ trợ và xác định thời gian giao hàng dự kiến.');
manager.addAnswer('vi','TRHSS16K','Chúng tôi có dịch vụ giao hàng tận nơi. Để xác định thời gian giao hàng dự kiến, bạn có thể tham khảo các phương pháp sau: Kiểm tra thông tin về thời gian giao hàng dự kiến trên trang web hoặc ứng dụng của chúng tôi. Liên hệ với chúng tôi qua số điện thoại hoặc chat trực tuyến để được tư vấn về thời gian giao hàng dự kiến.');
manager.addAnswer('vi','TRHSS16K','Chúng tôi cung cấp dịch vụ giao hàng tận nơi. Để biết thời gian giao hàng dự kiến, bạn có thể làm như sau: Truy cập vào trang web hoặc ứng dụng của chúng tôi để tìm thông tin về thời gian giao hàng dự kiến. Liên hệ với chúng tôi qua số điện thoại hoặc email để được hỗ trợ và xác định thời gian giao hàng dự kiến.');
manager.addAnswer('vi','TRHSS16K','Chúng tôi sẵn lòng cung cấp dịch vụ giao hàng tận nơi. Để xác định thời gian giao hàng dự kiến, bạn có thể thực hiện các bước sau: Kiểm tra thông tin về thời gian giao hàng dự kiến trên trang web hoặc ứng dụng của chúng tôi. Liên hệ với chúng tôi qua số điện thoại hoặc chat trực tuyến để được tư vấn về thời gian giao hàng dự kiến.');


//URHSS17K
manager.addDocument('vi','Làm thế nào để quản lý các đơn hàng đang chờ xử lý và đơn hàng đã hoàn thành trong hệ thống?','URHSS17K');
//Ans
manager.addAnswer('vi','URHSS17K','[Null]');
//=> WRONG ANSWER :=>error [Answer Not Null]






manager.save();
manager.train();




module.exports = manager;
