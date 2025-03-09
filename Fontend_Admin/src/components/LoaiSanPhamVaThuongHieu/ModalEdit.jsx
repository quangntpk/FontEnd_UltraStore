import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from 'react-hot-toast'; // Import toast

const ModalEdit = ({ isOpen, onClose, loaiSanPham, onEditSuccess, fetchLoaiSanPhams }) => {
  const [tenLoaiSanPham, setTenLoaiSanPham] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5261";

  useEffect(() => {
    if (loaiSanPham) {
      setTenLoaiSanPham(loaiSanPham.tenLoaiSanPham || "");
    }
  }, [loaiSanPham]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/LoaiSanPham/${loaiSanPham.maLoaiSanPham}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maLoaiSanPham: loaiSanPham.maLoaiSanPham, tenLoaiSanPham }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật loại sản phẩm.");
      }

      if (response.status === 204) {
        await fetchLoaiSanPhams();
      } else {
        const updatedLoaiSanPham = await response.json();
        onEditSuccess(updatedLoaiSanPham);
      }

      onClose();
      toast.success("Cập nhật loại sản phẩm thành công!"); // Thay alert bằng toast
    } catch (err) {
      setError(err.message);
      toast.error(err.message); // Hiển thị lỗi bằng toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sửa Loại Sản Phẩm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenLoaiSanPham" className="text-right">
                Tên Loại Sản Phẩm
              </Label>
              <Input
                id="tenLoaiSanPham"
                value={tenLoaiSanPham}
                onChange={(e) => setTenLoaiSanPham(e.target.value)}
                className="col-span-3"
                placeholder="Nhập tên loại sản phẩm"
                required
                maxLength={40}
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEdit;