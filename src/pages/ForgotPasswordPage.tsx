import {useState} from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";

import {useAppDispatch} from "@/store/hooks";
import {sendResetPasswordEmail} from "@/store/user/user.actions";
import type {ResetPasswordFormData} from "@/types/user/user.types";
import {resetPasswordEmailRules} from "@/utils/formValidation";

function ForgotPasswordPage() {
    const dispatch = useAppDispatch();
    const [sent, setSent] = useState(false);

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<ResetPasswordFormData>({mode: "onTouched"});

    // Xử lý submit form - gửi email đặt lại mật khẩu
    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        try {
            await dispatch(sendResetPasswordEmail({email: data.email})).unwrap();
            setSent(true);
            reset();
        } catch (msg) {
            toast.error(String(msg));
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={5}>
                    {sent ? (
                        // Thông báo đã gửi email
                        <div className="text-center py-5">
                            <h4 className="fw-bold mb-3">Xác nhận quên mật khẩu</h4>
                            <p className="text-muted mb-4">
                                Nếu bạn đã đăng kí tài khoản với email bạn cung cấp, bạn sẽ nhận
                                được email để hoàn thành việc cài đặt lại mật khẩu.
                            </p>
                        </div>
                    ) : (
                        // Form nhập email
                        <>
                            <h5 className="fw-bold text-center mb-3">Quên mật khẩu</h5>
                            <Form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập địa chỉ Email đã đăng ký"
                                        isInvalid={!!errors.email}
                                        {...register("email", resetPasswordEmailRules)}
                                        className="py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 bg-nld-auth border-0 py-2 fw-bold mb-4"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    Lấy lại mật khẩu
                                </Button>
                            </Form>
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="small text-muted text-decoration-none"
                                >
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ForgotPasswordPage;
