import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditProductModal = ({ isEditModalOpen, setIsEditModalOpen, selectedProduct, productData }) => {
  const [colors, setColors] = useState([]);
  const [tenSanPham, setTenSanPham] = useState("");
  const [maThuongHieu, setMaThuongHieu] = useState("");
  const [loaiSanPham, setLoaiSanPham] = useState("");
  const [moTa, setMoTa] = useState("");
  const [errors, setErrors] = useState({});
  // Khởi tạo dữ liệu khi productData thay đổi
  useEffect(() => {
    if (productData && productData.length > 0) {
      const productInfo = productData[0];
      setTenSanPham(productInfo.tenSanPham || "");
      setMaThuongHieu(productInfo.maThuongHieu || "");
      setLoaiSanPham(productInfo.loaiSanPham || "");
      setMoTa(productInfo.moTa || "");
      initializeColors(productData);
    }
  }, [productData]);

  const initializeColors = (data) => {
    if (data && data.length > 0) {
      const uniqueColors = data.map(item => ({
        color: `#${item.mauSac}`,
        sizes: item.details.map(detail => ({
          size: detail.kichThuoc.trim(),
          price: detail.gia.toString(),
          quantity: detail.soLuong.toString()
        }))
      }));
      setColors(uniqueColors);
    } else {
      setColors([{ color: '#ffffff', sizes: [{ size: 'S', price: '', quantity: '' }] }]);
    }
  };

  const handleAddColor = () => {
    setColors([...colors, { color: '#ffffff', sizes: [{ size: 'S', price: '', quantity: '' }] }]);
  };

  const handleAddSize = (colorIndex) => {
    const newColors = [...colors];
    newColors[colorIndex].sizes.push({ size: 'S', price: '', quantity: '' });
    setColors(newColors);
  };

  const handleRemoveSize = (colorIndex, sizeIndex) => {
    const newColors = [...colors];
    newColors[colorIndex].sizes.splice(sizeIndex, 1);
    setColors(newColors);
  };

  const handleRemoveColor = (colorIndex) => {
    const newColors = colors.filter((_, index) => index !== colorIndex);
    setColors(newColors);
  };

  const handleInputChange = (colorIndex, sizeIndex, field, value) => {
    const newColors = [...colors];
    if (field === 'color') {
      newColors[colorIndex].color = value;
    } else {
      newColors[colorIndex].sizes[sizeIndex][field] = value;
    }
    setColors(newColors);
  };

  const handleSaveChanges = async () => {
    const updatedData = colors.map(colorItem => ({
      ID: selectedProduct?.id || "A00001",
      TenSanPham: tenSanPham,
      MaThuongHieu: parseInt(maThuongHieu),
      LoaiSanPham: parseInt(loaiSanPham),
      MauSac: colorItem.color.slice(1),
      MoTa: moTa || null,
      HinhAnhs: null,
      Details: colorItem.sizes.map(sizeItem => ({
        KichThuoc: sizeItem.size.padEnd(10, ' ').trim(),
        SoLuong: parseInt(sizeItem.quantity),
        Gia: parseInt(sizeItem.price)
      }))

    }));
  
    let errorList = {};
    let hasError = false;
    const colorSet = new Set();

    updatedData.forEach((item, index) => {

      if (colorSet.has(item.MauSac)) {
        errorList[`${index}-mauSac`] = `- Màu ${item.MauSac} đã tồn tại.`;
        hasError = true;
      } else {
        colorSet.add(item.MauSac);
      }
  
      const sizeSet = new Set();
      item.Details.forEach((Detail, detailIndex) => {

        if (sizeSet.has(Detail.KichThuoc)) {
          errorList[`${index}-details-${detailIndex}-kichThuoc`] = `- Kích thước ${Detail.KichThuoc} của mã màu ${item.MauSac} đã tồn tại.`;
          hasError = true;
        } else {
          sizeSet.add(Detail.KichThuoc);
        }
  

        if (Detail.SoLuong <= 0) {
          errorList[`${index}-details-${detailIndex}-soLuong`] = `- Số lượng của kích thước ${Detail.KichThuoc} thuộc mã màu ${item.MauSac} phải lớn hơn 0.`;
          hasError = true;
        }
  
        if (Detail.Gia <= 0) {
          errorList[`${index}-details-${detailIndex}-gia`] = `- Giá của kích thước ${Detail.KichThuoc} thuộc mã màu ${item.MauSac} phải lớn hơn 0.`;
          hasError = true;
        }
      });
    });
  
    if (hasError) {
      setErrors(errorList);
    } else {
      setErrors({});
      console.log("Lưu thành công", updatedData);

    // Call API
    try {
      const response = await fetch("http://localhost:5261/api/SanPham/EditSanPham", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Cập nhật sản phẩm thành công!");
        setIsEditModalOpen(false); 
      } else {
        alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu tới API.");
    }
    }
  };
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="max-w-7xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chỉnh sửa thông tin sản phẩm</DialogTitle>          
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Tên Sản Phẩm</label>
                  <Input
                    value={tenSanPham}
                    onChange={(e) => setTenSanPham(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Thương Hiệu</label>
                  <select
                    value={maThuongHieu}
                    onChange={(e) => setMaThuongHieu(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="1">Gucci</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Loại Sản Phẩm</label>
                  <select
                    value={loaiSanPham}
                    onChange={(e) => setLoaiSanPham(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="1">Áo</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-12 text-center font-medium">
                  <div className="col-span-2 ml-12">Màu Sắc</div>
                  <div className="col-span-2 ml-10">Kích Thước</div>
                  <div className="col-span-2 ml-5">Đơn Giá</div>
                  <div className="col-span-2 ml-3">Số Lượng</div>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {colors.map((colorItem, colorIndex) => (
                  <div key={colorIndex} className="mt-4 border p-4 rounded relative">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveColor(colorIndex)}
                      className="absolute top-2 right-2"
                    >
                      X
                    </Button>
                    <div className="grid grid-cols-10 gap-4 border rounded p-4">
                      <div className="col-span-2 flex justify-center">
                        <input
                          type="color"
                          value={colorItem.color}
                          onChange={(e) => handleInputChange(colorIndex, null, 'color', e.target.value)}
                          className="w-[100px] h-[100px] border-2 border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-8">
                        {colorItem.sizes.map((sizeItem, sizeIndex) => (
                          <div key={sizeIndex} className="grid grid-cols-12 gap-2 items-center mb-2">
                            <div className="col-span-2">
                              <select
                                value={sizeItem.size}
                                onChange={(e) => handleInputChange(colorIndex, sizeIndex, 'size', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                                <option value="XXXL">XXXL</option>
                              </select>
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                min="1"
                                placeholder="Đơn Giá"
                                value={sizeItem.price}
                                onChange={(e) => handleInputChange(colorIndex, sizeIndex, 'price', e.target.value)}
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                min="1"
                                placeholder="Số Lượng"
                                value={sizeItem.quantity}
                                onChange={(e) => handleInputChange(colorIndex, sizeIndex, 'quantity', e.target.value)}
                                className="w-[100px]"
                              />
                            </div>
                            <div className="col-span-2 flex items-left justify-start gap-2 ml-3">
                              {colorItem.sizes.length > 1 && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
                                >
                                  x
                                </Button>
                              )}
                              {sizeIndex === colorItem.sizes.length - 1 && (
                                <Button onClick={() => handleAddSize(colorIndex)} size="sm">
                                  +
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-center ml-10">
                <Button onClick={handleAddColor} className="w-[250px]">
                  +
                </Button>
              </div>
            </div>

            <div className="col-span-4 space-y-4">
              <div>
                <label className="block mb-1 font-medium">Hình Ảnh</label>
                <div className="w-full h-[300px] border flex items-center justify-center">
                  <p className="text-muted-foreground">Chưa có hình ảnh</p>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Mô Tả</label>
                <textarea
                  className="w-full h-[200px] p-2 border rounded-md"
                  value={moTa}
                  onChange={(e) => setMoTa(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>
              <div>
                    {Object.keys(errors).length > 0 && (
                  <div className="text-red-500 mb-4">
                    Đã xảy ra lỗi: 
                    <ul>
                      {Object.values(errors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSaveChanges}>Lưu Thay Đổi</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;