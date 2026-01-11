import {Card} from 'react-bootstrap';

function TransactionsPanel() {
    return (
        <Card className="border-0 shadow-sm p-4">
            <h4 className="profile-section-title mb-4">
                <span className="profile-section-title__bar"/>
                Lịch sử giao dịch
            </h4>
            <p className="text-muted mb-0">Chưa có giao dịch nào.</p>
        </Card>
    );
}

export default TransactionsPanel;
