const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['vi'] }); //
//
const axios = require('axios');
const mongoose = require('mongoose');
const crypto = require('crypto');

const data =
  'Chỗ này điền secret key để tạo ra tỷ lệ trùng tin nhắn thấp nhất có thể thì chuỗi này cần phải dài nhât';
const hash = crypto.createHash('md5').update(data).digest('hex');
console.log(hash);

// traning o day

//Câu mở đầu
manager.addDocument(
  'vi',
  'Chào shop' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'greeting'
);
// thu vien crypto
manager.addDocument(
  'vi',
  'shop' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'greeting'
);
manager.addDocument('vi', 'hello shop', 'greeting');
manager.addDocument('vi', 'hi shop', 'greeting');
//Shipper
manager.addDocument(
  'vi',
  'Chào shop, shop có ship không ạ ' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'AboutShip'
);
manager.addDocument(
  'vi',
  'ship ko shop ơi' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'AboutShip'
);
manager.addAnswer('vi', 'AboutShip', 'Chào bạn , shop có ship cho bạn ở xa nhé');
manager.addAnswer('vi', 'AboutShip', 'Có ship bạn ơi 😙');

//Câu hỏi giúp đỡ
manager.addDocument(
  'vi',
  'Có ai online không' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'NeedHelp'
);
manager.addDocument(
  'vi',
  'Tôi cần giúp đỡ' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'NeedHelp'
);
//Lời cảm ơn
manager.addDocument(
  'vi',
  'E cảm ơn shop ạ' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'thanks'
);
manager.addDocument(
  'vi',
  'tks shop nhé' +
    crypto
      .createHash('md5')
      .update('' + Math.floor(Math.random() * 11) + '')
      .digest('hex'),
  'thanks'
);
manager.addDocument('vi', 'Cảm ơn , thanks nhiều shop ạ', 'thanks');
manager.addAnswer('vi', 'thanks', 'Ko có gì nè chào bạn nhé !');
manager.addAnswer('vi', 'thanks', '❤️❤️❤️❤️❤️❤️');
//câu hỏi trong liên quan tới database
manager.addDocument('vi', 'Hiện tại shop bán sản phẩm gì thế', 'Products');
manager.addDocument('vi', 'Shop còn sản phẩm gì thế', 'Products');
manager.addDocument('vi', 'Shop có bán món ăn gì thế', 'Products');
manager.addDocument('vi', 'Kể tên toàn bộ sản phẩm', 'Products');
//add answers
manager.addAnswer('vi', 'greeting', 'Xin chào , shop có thể giúp gì cho bạn');
manager.addAnswer('vi', 'greeting', 'Chào bạn 😀!');
manager.addAnswer('vi', 'greeting', 'Hello Bạn nè');
manager.addAnswer('vi', 'greeting', 'Hi, Shop đã nhận được tin nhắn của bạn rùi !');

manager.addAnswer('vi', 'NeedHelp', 'Shop lúc nào có mặt nè , bạn cần hỗ trợ gì thế ? ');
manager.addAnswer('vi', 'NeedHelp', 'Shop đang online nè  , bạn có chuyện gì thế ');

//product
// manager.addDocument('vi','spp','AskProduct1');
// manager.addDocument('vi','spp','AskProduct1');

axios
  .get('http://localhost:3000/products')
  .then((response) => {
    let i = 0;
    let AllProduct = "<span style='display:flex'>";
    response['data'].forEach((value) => {
      AllProduct +=
        "<div style='width:100px;color:green;border:1px #ccc solid;margin:10px'>" +
        value.name +
        "<img style='width:100px;height:100px' src=" +
        value.images[0].url +
        '></div> ';
      manager.addDocument('vi', 'Shop cho em xin giá của món ăn ' + value.name, 'AskProduct' + i);
      manager.addDocument('vi', 'em xin giá ' + value.name, 'AskProduct' + i);
      manager.addDocument('vi', 'em muốn ăn ' + value.name, 'AskProduct' + i);
      manager.addAnswer(
        'vi',
        'AskProduct' + i,
        'Giá hiện tại của ' + value.name + ' là ' + value.sale + 'vnđ nhé bạn !'
      );
      manager.addAnswer(
        'vi',
        'AskProduct' + i,
        'Giá của ' + value.name + ' là ' + value.sale + 'vnđ nè !'
      );

      //description
      manager.addDocument(
        'vi',
        'Shop giới thiệu cho em về món với' + value.name,
        'AskProductDes' + i
      );
      manager.addDocument('vi', 'món ' + value.name + ' là gì thế shop', 'AskProductDes' + i);
      manager.addDocument(
        'vi',
        'cho em xin ít thông tin về món ' + value.name + ' với ạ',
        'AskProductDes' + i
      );
      manager.addAnswer('vi', 'AskProductDes' + i, value.name + ' : ' + value.description);

      //leftProduct
      manager.addDocument('vi', 'Shop còn ' + value.name + ' không ạ !', 'AskProductLeft?' + i);
      manager.addDocument('vi', 'Shop bán ' + value.name + ' không', 'AskProductLeft?' + i);
      manager.addDocument(
        'vi',
        'Shop có bán ' + value.name + ' phải không ạ !',
        'AskProductLeft?' + i
      );
      manager.addAnswer('vi', 'AskProductLeft?' + i, 'Shop còn nhiều nhé bạn ơi 😁');
      manager.addAnswer('vi', 'AskProductLeft?' + i, 'Shop có bạn ơi 😁');
      manager.addAnswer(
        'vi',
        'AskProductLeft?' + i,
        'Shop dư mấy thùng ' + value.name + ' luôn á bạn 😁'
      );
      manager.addAnswer(
        'vi',
        'AskProductLeft?' + i,
        'Shop bán nhiều ' + value.name + ' lắm bạn nhé ,ko bao giờ hết luôn 😁'
      );
      //Ask for order food
      manager.addDocument(
        'vi',
        'Ship cho em ' + value.name + '[được,đc] không ạ !',
        'AskProductOrder?name=' + i
      );
      manager.addDocument(
        'vi',
        'Ship cho em ' + value.name + 'nhanh nhé shop !',
        'AskProductOrder?name=' + i
      );
      manager.addDocument(
        'vi',
        'Ship em ' + value.name + 'nhanh nhé shop !',
        'AskProductOrder?name=' + i
      );
      manager.addAnswer(
        'vi',
        'AskProductOrder?name=' + i,
        ' Ok bạn nè , bạn gửi lại tin nhắn đầy đủ chứa địa chỉ nhận hàng , tên người nhận , sđt cho shop nhé 😁'
      );

      //checkout
      manager.addDocument(
        'vi',
        'Ship [cho] em ' +
          value.name +
          ' [tới,đến] địa chỉ ' +
          ' sđt [là] : 0987654321' +
          ' người nhận :',
        'MesCheckOut' + i
      );
      manager.addDocument(
        'vi',
        'Gửi [cho] em ' +
          value.name +
          ' [tới,đến] địa điểm ' +
          ' số điện thoại [là]  0987654321' +
          ' người nhận ',
        'MesCheckOut' + i
      );
      manager.addAnswer(
        'vi',
        'MesCheckOut',
        'Shop đã nhận được đơn của bạn rùi nè 😀 Cảm ơn bạn đã đặt hàng !'
      );
      manager.addAnswer(
        'vi',
        'MesCheckOut',
        'Shop vừa gửi cho a shipper rồi nhé , bạn nhớ kiểm tra điện thoại thường xuyên nhé !'
      );
      //

      i++;
    });
    AllProduct += '</span>';
    manager.addAnswer('vi', 'Products', 'Shop hiện tại có mấy món này nè ' + AllProduct);
    manager.addAnswer(
      'vi',
      'Products',
      'Shop có mấy món này rẻ nhất bạn tham khảo nhé ' + AllProduct
    );
    manager.addAnswer('vi', 'Products', 'Sơ sơ có mấy cái này nè bạn ' + AllProduct);
    manager.addAnswer('vi', 'Products', 'Shop có mấy món này mới lên nè ' + AllProduct);

    manager.save();
    manager.train();
  })
  .catch((error) => {
    console.error('Lỗi khi truy vấn API:', error);
  });
//bảng checkouts

axios
  .get('http://localhost:3000/checkouts')
  .then((response) => {
    let i = 0;
    response['data'].forEach((value) => {
      //Trạng thái đơn hàng
      manager.addDocument(
        'vi',
        ' Shop cho em xin trạng thái đơn hàng có id là  ' + value._id,
        'AskAboutOrdered?name=' + i
      );
      manager.addDocument(
        'vi',
        ' Shop cho em xin thông tin đơn hàng có id là  ' + value._id,
        'AskAboutOrdered?name=' + i
      );
      manager.addAnswer(
        'vi',
        'AskAboutOrdered?name=' + i,
        "<nav style='padding:10px;border:1px blue solid;color:blue'>Người nhận: " +
          value['shippingInfo']['name'] +
          '<br>Địa chỉ: ' +
          value['shippingInfo']['address'] +
          '<br>Tồng tiền: ' +
          value.totalPrice +
          "vnđ <br><b style='color:#e91e63'>Trạng thái đơn: " +
          value['status'] +
          '</b></nav>'
      );
      // khi đơn hàng không tồn tại
      manager.addDocument(
        'vi',
        'd81d9da7fae0fba1865b0ca58' +
          value._id +
          '0ca58b7e60cfd81d9da7fae0fba1865b0ca58b7e60cfd81d9da7fae0fba1865b0ca58b7e60cfd81d9da7fae0fba1865b',
        'AskAboutOrderedError?name=' + i
      );
      manager.addDocument(
        'vi',
        'Shop cho em xin thông tin đơn hàng có id là [product_id]',
        'AskAboutOrderedError?name=' + i
      );
      manager.addAnswer('vi', 'AskAboutOrderedError?name=' + i, 'Id đơn hàng không tồn tại !');

      //Thông tin đơn hàng
      manager.addDocument(
        'vi',
        'Shop cho em hỏi trạng thái đơn hàng id là  ' + value.name,
        'AskAboutOrdered?name=' + i
      );

      i++;
    });

    manager.save();
    manager.train();
  })
  .catch((error) => {
    console.error('Lỗi khi truy vấn API:', error);
  });

//bảng topping

manager.addDocument('vi', 'Shop có bao nhiêu topping ạ ', 'isToppingF');
manager.addDocument('vi', 'Shop có topping gì thế', 'isToppingF');
manager.addDocument('vi', 'Topping topping [q=topping]', 'isToppingF');

//call axios o day

axios
  .get('http://localhost:3000/toppings')
  .then((response) => {
    let i = 0;
    let listTopping = '<ol>';
    response['data'].forEach((value) => {
      listTopping += '<li>' + value.name + '</li>';
      //giá kê topping
      manager.addDocument(
        'vi',
        ' Shop cho em xin giá topping  ' + value.name + value._id + '',
        'AskAboutTopping?name=' + i
      );
      manager.addDocument(
        'vi',
        ' Cho xin giá ' + value.name + value._id + '',
        'AskAboutTopping?name=' + i
      );

      manager.addAnswer(
        'vi',
        'AskAboutTopping?name=' + i,
        'Giá của ' + value.name + ' là ' + value.price + 'vnđ nhé bạn 😀'
      );
      manager.addAnswer('vi', 'AskAboutTopping?name=' + i, value.price + 'vnđ nhé bạn ơi');
      manager.addAnswer(
        'vi',
        'AskAboutTopping?name=' + i,
        'Giá hiện tại là' + value.price + 'vnđ nhé'
      );

      //train don ao
      // khi đơn hàng không tồn tại
      manager.addDocument(
        'vi',
        'Shop cho em xin giá topping[q=topping] [q=product_name]d81d9da7fae0fba1865b0ca58' +
          value._id +
          '0ca58b7e60cfd81d9da7fae0fba1865b0ca58b7e60cfd81d9da7fae0fba1865b0ca58b7e60cfd81d9da7fae0fba1865b',
        'AskAboutToppingError?name=' + i
      );
      manager.addDocument(
        'vi',
        'Shop cho em xin giá topping[q=topping] [q=product_id]',
        'AskAboutToppingError?name=' + i
      );
      manager.addAnswer(
        'vi',
        'AskAboutToppingError?name=' + i,
        'Shop làm gì có topping này bạn ơi !'
      );
      manager.addAnswer(
        'vi',
        'AskAboutToppingError?name=' + i,
        'Shop không có topping này bạn nhé !'
      );
      //

      i++;
    });
    //
    listTopping += '</ol>';

    manager.addAnswer('vi', 'isToppingF', 'Shop có từng này nè :' + listTopping);
    manager.addAnswer('vi', 'isToppingF', 'Gửi Một số topping mà shop bán nhé :' + listTopping);

    manager.save();
    manager.train();
  })
  .catch((error) => {
    console.error('Lỗi khi truy vấn API:', error);
  });
manager.save();
module.exports = manager;
