import React, { useState } from 'react';
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

const ModalCreate = ({ isOpen, onClose, onCreateSuccess }) => {
  const [tenLoaiSanPham, setTenLoaiSanPham] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5261";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/LoaiSanPham`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenLoaiSanPham }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể thêm loại sản phẩm.");
      }

      const newLoaiSanPham = await response.json();
      onCreateSuccess(newLoaiSanPham);
      setTenLoaiSanPham("");
      onClose();
      toast.success("Thêm loại sản phẩm thành công!"); // Thay alert bằng toast
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
          <DialogTitle>Thêm Loại Sản Phẩm</DialogTitle>
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
              {loading ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreate;