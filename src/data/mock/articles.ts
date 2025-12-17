import type { Article } from '../../types';

export const ARTICLES: Article[] = [
  {
    id: 'a-001',
    title: 'Nga - Ukraine liên tiếp "ăn miếng trả miếng", tập kích quyết liệt',
    slug: 'nga-ukraine-lien-tiep-an-mieng-tra-mieng-tap-kich-quyet-liet',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Hai bên tiếp tục công bố các đợt tập kích và đánh chặn, gây áp lực lên phòng không và hạ tầng.',
    content: `
      <p><strong>Rạng sáng</strong>, căng thẳng Nga - Ukraine tiếp tục nóng lên khi các đợt tấn công qua lại được ghi nhận ở nhiều khu vực.</p>
      <p>Một số nơi phát cảnh báo không kích kéo dài, trong khi lực lượng phòng không tăng cường theo dõi và đánh chặn.</p>

      <h3>Điểm đáng chú ý</h3>
      <ul>
        <li>UAV và tên lửa được sử dụng với mật độ cao.</li>
        <li>Hai phía đưa ra con số thống kê khác nhau theo từng thời điểm.</li>
        <li>Hạ tầng dân sự và hậu cần có thể bị ảnh hưởng gián tiếp.</li>
      </ul>

      <p>Diễn biến thay đổi nhanh, thông tin thường cần đối chiếu thêm từ nhiều nguồn.</p>
    `.trim(),
    thumbnail:
      'https://nld.mediacdn.vn/zoom/600_315/291774122806476800/2025/12/17/anh-duoc-tao-boi-phuonglinhnld-luc-49054714360068-17659700761411096160932-17-0-1017-1600-crop-17659701531091422451244.png',
    coverImage:
      'https://nld.mediacdn.vn/zoom/1200_630/291774122806476800/2025/12/17/anh-duoc-tao-boi-phuonglinhnld-luc-49054714360068-17659700761411096160932-17-0-1017-1600-crop-17659701531091422451244.png',
    author: 'NLD.COM.VN',
    source: 'NLD',
    publishedAt: '2025-12-17T19:10:00+07:00',
    tags: ['Nga', 'Ukraine', 'UAV', 'tập kích', 'phòng không'],
    isFeatured: true,
    isHot: true
  },
  {
    id: 'a-002',
    title: 'Tổng thống Thổ Nhĩ Kỳ cảnh báo cả Nga và Ukraine',
    slug: 'tong-thong-tho-nhi-ky-canh-bao-ca-nga-va-ukraine',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Tổng thống Recep Tayyip Erdogan nhấn mạnh an toàn hàng hải, kêu gọi kiềm chế tại biển Đen.',
    content: `
      <p><strong>Thổ Nhĩ Kỳ</strong> lên tiếng về tình hình an ninh hàng hải ở biển Đen, nơi có vai trò quan trọng với thương mại và vận tải.</p>
      <p>Thông điệp chính tập trung vào việc tránh để xung đột lan rộng và hạn chế rủi ro với tàu dân sự.</p>

      <h3>Vì sao biển Đen nhạy cảm?</h3>
      <ol>
        <li>Là tuyến vận chuyển ngũ cốc và năng lượng.</li>
        <li>Chi phí bảo hiểm/đi lại tăng mạnh khi rủi ro tăng.</li>
        <li>Thị trường dễ biến động theo tin tức an ninh.</li>
      </ol>

      <p>Các phản ứng ngoại giao thường đi kèm lời kêu gọi kiềm chế và tôn trọng luật hàng hải.</p>
    `.trim(),
    thumbnail:
      'https://nld.mediacdn.vn/zoom/600_315/291774122806476800/2025/12/17/1461097-17659373944982121012387-0-0-638-1020-crop-17659374489811533287543.jpg',
    coverImage:
      'https://nld.mediacdn.vn/zoom/1200_630/291774122806476800/2025/12/17/1461097-17659373944982121012387-0-0-638-1020-crop-17659374489811533287543.jpg',
    author: 'NLD.COM.VN',
    source: 'NLD',
    publishedAt: '2025-12-17T11:58:00+07:00',
    tags: ['Thổ Nhĩ Kỳ', 'Erdogan', 'biển Đen', 'an ninh hàng hải'],
    isFeatured: true,
    isHot: true
  },
  {
    id: 'a-003',
    title: 'Biến động mạnh sau niêm yết: bài học quản trị rủi ro cho nhà đầu tư',
    slug: 'bien-dong-manh-sau-niem-yet-bai-hoc-quan-tri-rui-ro',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Bài viết mock để test UI: nhiều đoạn ngắn, có danh sách và tiêu đề phụ.',
    content: `
      <p><strong>Cổ phiếu mới niêm yết</strong> thường biến động mạnh vì kỳ vọng cao, thanh khoản tăng nhanh và tâm lý FOMO.</p>
      <p>Trong giai đoạn này, kỷ luật quản trị rủi ro quan trọng hơn việc “đu đỉnh - bắt đáy”.</p>

      <h3>3 nguyên tắc đơn giản</h3>
      <ul>
        <li>Đặt mức cắt lỗ trước khi vào lệnh.</li>
        <li>Không dùng đòn bẩy quá tay khi biến động cao.</li>
        <li>Có kế hoạch: mua/giữ/bán theo kịch bản.</li>
      </ul>
    `.trim(),
    thumbnail:
      'https://nld.mediacdn.vn/zoom/600_315/291774122806476800/2025/12/17/khoc-rong-17659453360801072378052-102-0-742-1024-crop-1765961330447378222019.png',
    coverImage:
      'https://nld.mediacdn.vn/zoom/1200_630/291774122806476800/2025/12/17/khoc-rong-17659453360801072378052-102-0-742-1024-crop-1765961330447378222019.png',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-17T12:59:00+07:00',
    tags: ['chứng khoán', 'quản trị rủi ro', 'biến động', 'nhà đầu tư'],
    isFeatured: false,
    isHot: true
  },
  {
    id: 'a-004',
    title: 'Biển Đen nóng lên: tuyến hàng hải và áp lực lên chuỗi cung ứng',
    slug: 'bien-den-nong-len-tuyen-hang-hai-va-ap-luc-len-chuoi-cung-ung',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Khi rủi ro hàng hải tăng, chi phí logistics và thời gian giao hàng có thể bị ảnh hưởng.',
    content: `
      <p>Với các tuyến vận tải biển quan trọng, chỉ cần một sự cố cũng có thể khiến phí bảo hiểm tăng và lịch tàu thay đổi.</p>
      <p>Doanh nghiệp thường phải điều chỉnh tuyến đi, dự phòng tồn kho và tính lại chi phí vận chuyển.</p>
      <h3>Hệ quả dễ thấy</h3>
      <ul>
        <li>Độ trễ giao hàng tăng</li>
        <li>Giá cước biến động</li>
        <li>Tâm lý thị trường bị ảnh hưởng</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1504847363954-62dfb1a1d11e?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1504847363954-62dfb1a1d11e?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-16T09:30:00+07:00',
    tags: ['biển Đen', 'logistics', 'chuỗi cung ứng'],
    isFeatured: false,
    isHot: true
  },
  {
    id: 'a-005',
    title: 'Ngoại giao con thoi: khi các nước tìm cách hạ nhiệt căng thẳng',
    slug: 'ngoai-giao-con-thoi-khi-cac-nuoc-tim-cach-ha-nhiet-cang-thang',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Các cuộc gặp song phương/đa phương thường tập trung vào giải pháp giảm leo thang.',
    content: `
      <p><strong>Ngoại giao</strong> thường chạy song song với diễn biến thực địa: vừa trao đổi, vừa quan sát phản ứng các bên.</p>
      <p>Một số chủ đề hay được nhắc tới gồm: an toàn dân sự, hành lang nhân đạo, trao đổi tù nhân, và bảo đảm thương mại.</p>
      <h3>Điểm hay gặp trong tuyên bố</h3>
      <ul>
        <li>Kêu gọi kiềm chế</li>
        <li>Tôn trọng luật quốc tế</li>
        <li>Giữ an toàn cho tuyến dân sự</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-15T18:15:00+07:00',
    tags: ['ngoại giao', 'đàm phán', 'căng thẳng'],
    isFeatured: false,
    isHot: false
  },
  {
    id: 'a-006',
    title: 'Phân tích nhanh: vì sao xung đột kéo dài thường khó hạ nhiệt?',
    slug: 'phan-tich-nhanh-vi-sao-xung-dot-keo-dai-thuong-kho-ha-nhiet',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Một số yếu tố phổ biến khiến xung đột khó sớm kết thúc.',
    content: `
      <h3>Những yếu tố hay gặp</h3>
      <ul>
        <li>Khác biệt lợi ích chiến lược</li>
        <li>Thiếu cơ chế giám sát hiệu quả</li>
        <li>Áp lực dư luận trong nước</li>
      </ul>
      <p>Ngoài ra, yếu tố kinh tế và nguồn lực cũng có thể khiến tiến trình đàm phán kéo dài.</p>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-15T09:00:00+07:00',
    tags: ['phân tích', 'xung đột', 'địa chính trị'],
    isFeatured: true,
    isHot: false
  },
  {
    id: 'a-007',
    title: 'Tin nhanh: phát biểu mới nhất của các bên liên quan',
    slug: 'tin-nhanh-phat-bieu-moi-nhat-cua-cac-ben-lien-quan',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Tin ngắn để test UI danh sách bài.',
    content: `
      <p><strong>Cập nhật nhanh</strong> theo dòng thời gian: các tuyên bố mới, phản ứng ngoại giao và những diễn biến nổi bật.</p>
      <p>Bài dạng ngắn phù hợp để test layout list/compact.</p>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-14T22:10:00+07:00',
    tags: ['tin nhanh', 'cập nhật'],
    isFeatured: false,
    isHot: true
  },
  {
    id: 'a-008',
    title: 'Ảnh hưởng kinh tế: thị trường phản ứng ra sao trước tin nóng?',
    slug: 'anh-huong-kinh-te-thi-truong-phan-ung-ra-sao-truoc-tin-nong',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Tâm lý thị trường có thể đổi nhanh theo thông tin địa chính trị và rủi ro vận tải.',
    content: `
      <p>Khi rủi ro tăng, nhà đầu tư thường ưu tiên tài sản an toàn và giảm vị thế rủi ro.</p>
      <p>Các chỉ số vận tải, năng lượng, hàng hoá thường phản ứng nhanh hơn các nhóm khác.</p>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-14T10:20:00+07:00',
    tags: ['thị trường', 'kinh tế', 'rủi ro'],
    isFeatured: false,
    isHot: false
  },
  {
    id: 'a-009',
    title: 'Xem nhiều: Tổng hợp các mốc sự kiện trong tuần',
    slug: 'xem-nhieu-tong-hop-cac-moc-su-kien-trong-tuan',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Bài dạng tổng hợp để fill sidebar.',
    content: `
      <p><strong>Tuần qua</strong> ghi nhận nhiều mốc đáng chú ý, từ phát biểu ngoại giao tới biến động trên thực địa.</p>
      <ul>
        <li>Mốc 1: Tuyên bố/động thái mới</li>
        <li>Mốc 2: Phản ứng quốc tế</li>
        <li>Mốc 3: Ảnh hưởng kinh tế - vận tải</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-13T08:10:00+07:00',
    tags: ['tổng hợp', 'xem nhiều'],
    isFeatured: false,
    isHot: true
  },
  {
    id: 'a-010',
    title: 'Xem nhiều: Những câu hỏi thường gặp về tình hình hiện tại',
    slug: 'xem-nhieu-nhung-cau-hoi-thuong-gap-ve-tinh-hinh-hien-tai',
    categorySlug: 'quoc-te/hay-la',
    categoryName: 'Quốc tế',
    description: 'Bài dạng Q&A để test UI.',
    content: `
      <h3>Câu hỏi 1: Vì sao thông tin thay đổi liên tục?</h3>
      <p>Do diễn biến nhanh và cách các bên cập nhật theo các kênh khác nhau.</p>
      <h3>Câu hỏi 2: Tác động lớn nhất là gì?</h3>
      <p>Rủi ro hàng hải, năng lượng và chi phí logistics là nhóm dễ thấy nhất.</p>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-12T16:40:00+07:00',
    tags: ['hỏi đáp', 'xem nhiều'],
    isFeatured: false,
    isHot: false
  },
  {
    id: 'a-011',
    title: 'Xem nhiều: Dòng thời gian các diễn biến đáng chú ý',
    slug: 'xem-nhieu-dong-thoi-gian-cac-dien-bien-dang-chu-y',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Bài dạng timeline.',
    content: `
      <p><strong>Dòng thời gian</strong> (demo UI):</p>
      <ol>
        <li>Sáng: cập nhật ban đầu</li>
        <li>Trưa: phản ứng và điều chỉnh</li>
        <li>Tối: tổng hợp và đánh giá</li>
      </ol>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-12T09:10:00+07:00',
    tags: ['timeline', 'xem nhiều'],
    isFeatured: false,
    isHot: false
  },
  {
    id: 'a-012',
    title: 'Xem nhiều: 5 từ khóa nổi bật liên quan tình hình quốc tế',
    slug: 'xem-nhieu-5-tu-khoa-noi-bat-lien-quan-tinh-hinh-quoc-te',
    categorySlug: 'quoc-te',
    categoryName: 'Quốc tế',
    description: 'Bài dạng list keyword để test UI.',
    content: `
      <ul>
        <li>Biển Đen</li>
        <li>Phòng không</li>
        <li>Đàm phán</li>
        <li>Chuỗi cung ứng</li>
        <li>Rủi ro</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1505842465776-3bf1f90564f1?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1505842465776-3bf1f90564f1?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-11T14:30:00+07:00',
    tags: ['từ khóa', 'xem nhiều'],
    isFeatured: false,
    isHot: true
  },

  // Subcategory demo: /quoc-te/nguoi-viet-do-day
  {
    id: 'a-013',
    title: 'Người Việt ở nước ngoài chia sẻ cách thích nghi với mùa đông châu Âu',
    slug: 'nguoi-viet-o-nuoc-ngoai-chia-se-cach-thich-nghi-voi-mua-dong-chau-au',
    categorySlug: 'quoc-te/nguoi-viet-do-day',
    categoryName: 'Người Việt đó đây',
    description: 'Một vài mẹo nhỏ về sức khoẻ, ăn uống và đi lại để không “sốc nhiệt” khi trời lạnh.',
    content: `
      <p>Nhiều bạn du học sinh nói giai đoạn đầu rất dễ cảm lạnh do thay đổi khí hậu.</p>
      <p>Thói quen đơn giản: mặc nhiều lớp, giữ ấm cổ tay/cổ chân và uống đủ nước.</p>
      <h3>Mẹo nhanh</h3>
      <ul>
        <li>Chuẩn bị thuốc cảm cơ bản + vitamin C</li>
        <li>Luôn xem dự báo thời tiết trước khi ra ngoài</li>
        <li>Đi lại bằng phương tiện công cộng vào giờ cao điểm</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1486068720045-2b549f65a0a0?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486068720045-2b549f65a0a0?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-10T08:20:00+07:00',
    tags: ['du học', 'châu Âu', 'mùa đông', 'người Việt'],
    isFeatured: false,
    isHot: true
  },
  {
    id: 'a-014',
    title: 'Một ngày làm thêm của du học sinh: lịch học, lịch làm và cách cân bằng',
    slug: 'mot-ngay-lam-them-cua-du-hoc-sinh-lich-hoc-lich-lam-va-cach-can-bang',
    categorySlug: 'quoc-te/nguoi-viet-do-day',
    categoryName: 'Người Việt đó đây',
    description: 'Không phải lúc nào cũng “vừa học vừa làm” là màu hồng, nhưng có cách để đỡ stress.',
    content: `
      <p>Bạn A chia sẻ: “Mình chia lịch theo block 2 tiếng, việc gì cũng có deadline”.</p>
      <p>Quan trọng là ngủ đủ và không nhận quá nhiều ca liên tục.</p>
      <h3>Gợi ý (demo UI)</h3>
      <ul>
        <li>Ưu tiên môn khó trước</li>
        <li>Chừa 1 buổi/tuần để nghỉ</li>
        <li>Ghi lại chi tiêu để tránh “vỡ kế hoạch”</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-09T14:00:00+07:00',
    tags: ['du học sinh', 'làm thêm', 'cân bằng', 'thời gian'],
    isFeatured: false,
    isHot: false
  },
  {
    id: 'a-015',
    title: 'Người Việt mở quán nhỏ ở nước ngoài: bài toán thuê mặt bằng và giấy tờ',
    slug: 'nguoi-viet-mo-quan-nho-o-nuoc-ngoai-bai-toan-thue-mat-bang-va-giay-to',
    categorySlug: 'quoc-te/nguoi-viet-do-day',
    categoryName: 'Người Việt đó đây',
    description: 'Chuyện kinh doanh “nhỏ mà không nhỏ”: hợp đồng, thuế, và giấy phép.',
    content: `
      <p>Nhiều người chia sẻ phần khó nhất là giấy tờ và quy định địa phương.</p>
      <p>Khi mới bắt đầu, nên tìm mentor hoặc hỏi cộng đồng người Việt để tránh sai sót.</p>
      <h3>Checklist đơn giản</h3>
      <ul>
        <li>Hợp đồng thuê mặt bằng</li>
        <li>Giấy phép kinh doanh / vệ sinh</li>
        <li>Kế hoạch chi phí 3-6 tháng</li>
      </ul>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-08T09:15:00+07:00',
    tags: ['người Việt', 'kinh doanh', 'giấy tờ', 'mặt bằng'],
    isFeatured: false,
    isHot: true
  },
  {
    id: 'a-016',
    title: 'Cộng đồng người Việt tổ chức hoạt động thiện nguyện dịp cuối năm',
    slug: 'cong-dong-nguoi-viet-to-chuc-hoat-dong-thien-nguyen-dip-cuoi-nam',
    categorySlug: 'quoc-te/nguoi-viet-do-day',
    categoryName: 'Người Việt đó đây',
    description: 'Một hoạt động nhỏ nhưng giúp gắn kết cộng đồng và lan toả năng lượng tích cực.',
    content: `
      <p>Nhóm tình nguyện hỗ trợ phát đồ ăn và áo ấm cho người vô gia cư.</p>
      <p>Chương trình kêu gọi đóng góp theo khả năng, ưu tiên minh bạch và báo cáo công khai.</p>
    `.trim(),
    thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
    author: 'Nhóm dự án',
    source: 'Mock',
    publishedAt: '2025-12-07T18:05:00+07:00',
    tags: ['cộng đồng', 'thiện nguyện', 'cuối năm'],
    isFeatured: false,
    isHot: false
  }
];
