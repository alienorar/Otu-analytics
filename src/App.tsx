
"use client";

import React, { useState } from "react";
import type { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Pagination,
  Row,
  Col,
  Spin,
  Alert,
  Typography,
  type TableColumnsType,
} from "antd";
import { FileDoneOutlined } from "@ant-design/icons";

const { Title } = Typography;

const PRIMARY_COLOR = "#1E9FD9";

interface Contact {
  ID: string;
  LAST_NAME: string;
  NAME: string;
  SECOND_NAME: string;
  UTM_SOURCE: string;
  DATE_CREATE: string;
}

interface ApiResponse {
  data: Contact[];
  total?: number; // Optional: for pagination total if API provides it
}

interface FormValues {
  baseUrl: string;
}

const ApiRequestTable: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [baseUrl, setBaseUrl] = useState<string>("https://qabul.asianuniversity.uz");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5); // Fixed default value
  const [responseData, setResponseData] = useState<Contact[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<ApiResponse>(
        "https://bitrix-mini.asianuniversity.uz/api/contacts",
        {
          utm_url: `${baseUrl}`,
          page,
          limit,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data ?? [];
      setResponseData(data);
      setTotal(response.data.total ?? data.length); // Fallback to data length if total is not provided
    } catch (err) {
     const errorMessage = err instanceof AxiosError && err.response?.data?.error === "utm_source parameter not found in the URL"
        ? "Ushbu link hech kimga tegishli emas"
        : err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Noma'lum xato yuz berdi";
      setError(errorMessage);
      setResponseData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.validateFields().then(() => {
      setPage(1); // Reset to page 1 on new submission
      fetchData();
    }).catch(() => {
      setError("Iltimos, URL maydonini to'ldiring");
    });
  };

  const columns: TableColumnsType<Contact> = responseData.length > 0
    ? Object.keys(responseData[0]).map((key) => ({
        title: key.replace(/_/g, " "), // Format keys (e.g., LAST_NAME -> LAST NAME)
        dataIndex: key,
        key,
        render: (text: string) => text || "-", // Handle null/undefined values
      }))
    : [];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Card
        style={{ maxWidth: 1000, width: "100%", margin: 16, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileDoneOutlined style={{ color: PRIMARY_COLOR, fontSize: 24 }} />
            <Title level={3} style={{ margin: 0, color: PRIMARY_COLOR }}>
              API So‘rov Tizimi
            </Title>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            onSubmitCapture={handleSubmit}
            layout="vertical"
            initialValues={{ baseUrl }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Asosiy URL"
                  name="baseUrl"
                  rules={[
                    { required: true, message: "URL kiriting" },
                    { type: "url", message: "To'g'ri URL kiriting" },
                  ]}
                >
                  <Input
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
              >
                {loading ? "Yuklanmoqda..." : "Maʼlumotlarni Olish"}
              </Button>
            </Form.Item>
          </Form>

          {error && (
            <Alert
              message="Xato"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {responseData.length > 0 ? (
            <>
              <Table
                columns={columns}
                dataSource={responseData.map((item, index) => ({ ...item, key: item.ID || index }))}
                pagination={false}
                scroll={{ x: 600 }}
                style={{ marginBottom: 16 }}
                rowClassName={(_, index: number) =>
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }
                locale={{ emptyText: "Ma'lumot topilmadi" }}
              />
              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                onChange={(newPage) => {
                  setPage(newPage);
                  fetchData();
                }}
                showQuickJumper
                showTotal={(total) => `Jami: ${total} ta yozuv`}
                style={{ textAlign: "right" }}
              />
            </>
          ) : (
            !loading && !error && (
              <Alert
                message="Ma'lumot yo'q"
                description="So'rovni amalga oshirish uchun yuqoridagi maydonni to'ldiring."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ApiRequestTable;
