import {useEffect, useState} from 'react';
import {Badge, Card, Table} from 'react-bootstrap';
import {getUserTransactions} from '@/services/user/auth.api';
import {useAppSelector} from '@/store/hooks';
import {getCurrentUser} from '@/store/user/user.selectors';
import type {Transaction} from '@/types/user.types.ts';
import dayjs from 'dayjs';

function TransactionsPanel() {
    const user = useAppSelector(getCurrentUser);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            getUserTransactions(user.id)
                .then((data) => {
                    // Chuyển thành mảng transaction và sort theo ngày
                    const sorted = (data as unknown as Transaction[]).sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                    setTransactions(sorted);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user?.id]);

    const getStatusBadge = (status: string) => {
        if (status === 'SUCCESS') return <Badge bg="success">Thành công</Badge>;
        if (status === 'PENDING') return <Badge bg="warning" className="text-dark">Đang xử lý</Badge>;
        return <Badge bg="danger">Thất bại</Badge>;
    };

    return (
        <Card className="border-0 shadow-sm p-4">
            <h4 className="profile-section-title mb-4">
                <span className="profile-section-title__bar"/>
                Lịch sử giao dịch
            </h4>

            {loading ? (
                <p className="text-muted text-center py-3">Đang tải dữ liệu...</p>
            ) : transactions.length === 0 ? (
                <p className="text-muted mb-0">Chưa có giao dịch nào.</p>
            ) : (
                <div className="table-responsive">
                    <Table hover className="align-middle">
                        <thead className="bg-light">
                        <tr>
                            <th className="border-0 py-3 text-secondary small text-uppercase">Mã GD</th>
                            <th className="border-0 py-3 text-secondary small text-uppercase">Dịch vụ</th>
                            <th className="border-0 py-3 text-secondary small text-uppercase">Ngày tạo</th>
                            <th className="border-0 py-3 text-secondary small text-uppercase">Số tiền</th>
                            <th className="border-0 py-3 text-secondary small text-uppercase">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id}>
                                <td className="small font-monospace text-muted">{t.id.substring(0, 8)}...</td>
                                <td className="fw-semibold text-nld-blue">{t.productName}</td>
                                <td className="small">{dayjs(t.date).format('DD/MM/YYYY HH:mm')}</td>
                                <td className="fw-bold">{new Intl.NumberFormat('vi-VN').format(t.amount)}đ</td>
                                <td>{getStatusBadge(t.status)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Card>
    );
}

export default TransactionsPanel;
