import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Plus, Filter } from "lucide-react";
import ModalCreate from "@/components/LoaiSanPhamVaThuongHieu/ModalCreate";
import ModalEdit from "@/components/LoaiSanPhamVaThuongHieu/ModalEdit";
import toast from 'react-hot-toast'; // Import toast

const LoaiSanPham = () => {
  const [loaiSanPhams, setLoaiSanPhams] = useState([]);
  const [filteredLoaiSanPhams, setFilteredLoaiSanPhams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedLoaiSanPham, setSelectedLoaiSanPham] = useState(null);

  const API_URL = "http://localhost:5261";

  const fetchLoaiSanPhams = async (keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/LoaiSanPham?keyword=${encodeURIComponent(keyword)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      console.log("Dữ liệu từ API:", data);
      setLoaiSanPhams(data);
      setFilteredLoaiSanPhams(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu loại sản phẩm:", error.message);
      setError(error.message);
      toast.error(error.message); // Hiển thị lỗi bằng toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoaiSanPhams();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = loaiSanPhams.filter((lsp) =>
        lsp.tenLoaiSanPham.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLoaiSanPhams(filtered);
    } else {
      setFilteredLoaiSanPhams(loaiSanPhams);
    }
  }, [searchTerm, loaiSanPhams]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa loại sản phẩm này?")) {
      try {
        const response = await fetch(`${API_URL}/api/LoaiSanPham/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setLoaiSanPhams(loaiSanPhams.filter((lsp) => lsp.maLoaiSanPham !== id));
          setFilteredLoaiSanPhams(filteredLoaiSanPhams.filter((lsp) => lsp.maLoaiSanPham !== id));
          toast.success("Xóa loại sản phẩm thành công!"); // Thay alert bằng toast
        } else {
          const errorText = await response.text();
          toast.error(errorText || "Không thể xóa loại sản phẩm vì có sản phẩm liên quan.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa loại sản phẩm:", error);
        toast.error("Có lỗi xảy ra khi xóa loại sản phẩm.");
      }
    }
  };

  const handleCreateSuccess = (newLoaiSanPham) => {
    setLoaiSanPhams([...loaiSanPhams, newLoaiSanPham]);
    setFilteredLoaiSanPhams([...filteredLoaiSanPhams, newLoaiSanPham]);
  };

  const handleEditSuccess = (updatedLoaiSanPham) => {
    setLoaiSanPhams(
      loaiSanPhams.map((lsp) =>
        lsp.maLoaiSanPham === updatedLoaiSanPham.maLoaiSanPham ? updatedLoaiSanPham : lsp
      )
    );
    setFilteredLoaiSanPhams(
      filteredLoaiSanPhams.map((lsp) =>
        lsp.maLoaiSanPham === updatedLoaiSanPham.maLoaiSanPham ? updatedLoaiSanPham : lsp
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loại Sản Phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách loại sản phẩm trong hệ thống.
          </p>
        </div>
        <Button className="bg-purple hover:bg-purple-medium" onClick={() => setIsModalCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Loại Sản Phẩm
        </Button>
      </div>

      <ModalCreate
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onCreateSuccess={handleCreateSuccess}
      />

      <ModalEdit
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        loaiSanPham={selectedLoaiSanPham}
        onEditSuccess={handleEditSuccess}
        fetchLoaiSanPhams={fetchLoaiSanPhams}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh Sách Loại Sản Phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm loại sản phẩm..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 self-end">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Loại Sản Phẩm</TableHead>
                  <TableHead>Tên Loại Sản Phẩm</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-red-600">
                      Lỗi: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredLoaiSanPhams.length > 0 ? (
                  filteredLoaiSanPhams.map((lsp) => (
                    <TableRow key={lsp.maLoaiSanPham} className="hover:bg-muted/50">
                      <TableCell>{lsp.maLoaiSanPham}</TableCell>
                      <TableCell>{lsp.tenLoaiSanPham}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLoaiSanPham(lsp);
                                setIsModalEditOpen(true);
                              }}
                            >
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(lsp.maLoaiSanPham)}
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy loại sản phẩm nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoaiSanPham;