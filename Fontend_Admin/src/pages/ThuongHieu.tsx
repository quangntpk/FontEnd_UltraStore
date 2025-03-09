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

const ThuongHieu = () => {
  const [thuongHieus, setThuongHieus] = useState([]);
  const [filteredThuongHieus, setFilteredThuongHieus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5261"; // Port backend của bạn

  const fetchThuongHieus = async (keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/ThuongHieu?keyword=${encodeURIComponent(keyword)}`, {
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
      console.log("Dữ liệu từ API:", data); // Log để kiểm tra
      setThuongHieus(data);
      setFilteredThuongHieus(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thương hiệu:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThuongHieus();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = thuongHieus.filter((th) =>
        th.tenThuongHieu.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredThuongHieus(filtered);
    } else {
      setFilteredThuongHieus(thuongHieus);
    }
  }, [searchTerm, thuongHieus]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      try {
        const response = await fetch(`${API_URL}/api/ThuongHieu/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setThuongHieus(thuongHieus.filter((th) => th.maThuongHieu !== id));
          setFilteredThuongHieus(filteredThuongHieus.filter((th) => th.maThuongHieu !== id));
          alert("Xóa thương hiệu thành công!");
        } else {
          const errorText = await response.text();
          alert(errorText || "Không thể xóa thương hiệu vì có sản phẩm liên quan.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa thương hiệu:", error);
        alert("Có lỗi xảy ra khi xóa thương hiệu.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thương Hiệu</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách thương hiệu trong hệ thống.
          </p>
        </div>
        <Button className="bg-purple hover:bg-purple-medium">
          <Plus className="mr-2 h-4 w-4" /> Thêm Thương Hiệu
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh Sách Thương Hiệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm thương hiệu..."
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
                  <TableHead>Mã Thương Hiệu</TableHead>
                  <TableHead>Tên Thương Hiệu</TableHead>
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
                ) : filteredThuongHieus.length > 0 ? (
                  filteredThuongHieus.map((th) => (
                    <TableRow key={th.maThuongHieu} className="hover:bg-muted/50">
                      <TableCell>{th.maThuongHieu}</TableCell>
                      <TableCell>{th.tenThuongHieu}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Sửa</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(th.maThuongHieu)}
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
                      Không tìm thấy thương hiệu nào.
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

export default ThuongHieu;