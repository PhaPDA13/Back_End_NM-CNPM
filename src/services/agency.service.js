import { prisma } from '../lib/prisma.js'

export class AgencyService {
  // CREATE - Tạo đại lý mới
  static async create(data) {
    return await prisma.ho_so_dai_ly.create({
      data: {
        ten_dai_ly: data.ten_dai_ly,
        dien_thoai: data.dien_thoai,
        dia_chi: data.dia_chi,
        email: data.email,
        ma_quan: data.ma_quan,
        ma_loai: data.ma_loai,
        tien_no: data.tien_no || 0
      }
    });
  }

  // READ - Lấy tất cả đại lý
  static async getAll() {
    return await prisma.ho_so_dai_ly.findMany({
      include: {
        quan: true,        // Join với bảng quan
        loai_dai_ly: true  // Join với bảng loai_dai_ly
      }
    });
  }

  // READ - Lấy đại lý theo ID
  static async getById(id) {
    return await prisma.ho_so_dai_ly.findUnique({
      where: { ma_dai_ly: id },
      include: {
        quan: true,
        loai_dai_ly: true,
        phieu_xuat_hang: true,
        phieu_thu_tien: true
      }
    });
  }

  // UPDATE - Cập nhật đại lý
  static async update(id, data) {
    return await prisma.ho_so_dai_ly.update({
      where: { ma_dai_ly: id },
      data: {
        ten_dai_ly: data.ten_dai_ly,
        dien_thoai: data.dien_thoai,
        dia_chi: data.dia_chi,
        email: data.email,
        ma_quan: data.ma_quan,
        ma_loai: data.ma_loai
      }
    });
  }

  // DELETE - Xóa đại lý
  static async delete(id) {
    return await prisma.ho_so_dai_ly.delete({
      where: { ma_dai_ly: id }
    });
  }

  // Tìm kiếm với điều kiện
  static async search(filters) {
    return await prisma.ho_so_dai_ly.findMany({
      where: {
        ten_dai_ly: { contains: filters.name, mode: 'insensitive' },
        ma_quan: filters.ma_quan
      }
    });
  }
}
