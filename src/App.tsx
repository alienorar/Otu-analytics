
"use client";

import React, { useState } from "react";
import type { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  Card,
  Form,
  Input,
  Select,
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
const { Option } = Select;

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
  utmSource: string;
  page: number;
  limit: number;
}

const ApiRequestTable: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [baseUrl, setBaseUrl] = useState<string>("https://qabul.asianuniversity.uz");
  const [utmSource, setUtmSource] = useState<string>("919330011");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
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
          utm_url: `${baseUrl}?utm_source=${utmSource}`,
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
      const errorMessage = err instanceof AxiosError 
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
      setError("Iltimos, barcha maydonlarni to'ldiring");
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
            initialValues={{ baseUrl, utmSource, page, limit }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
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
              <Col xs={24} sm={12}>
                <Form.Item
                  label="UTM Source"
                  name="utmSource"
                  rules={[{ required: true, message: "UTM Source kiriting" }]}
                >
                  <Input
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="919330011"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Sahifa"
                  name="page"
                  rules={[{ required: true, message: "Sahifa raqamini kiriting" }]}
                >
                  <Input
                    type="number"
                    min={1}
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Limit"
                  name="limit"
                  rules={[{ required: true, message: "Limitni tanlang" }]}
                >
                  <Select value={limit} onChange={(value) => setLimit(Number(value))}>
                    {[5, 10, 20, 50].map((num) => (
                      <Option key={num} value={num}>
                        {num}
                      </Option>
                    ))}
                  </Select>
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
                rowClassName={(index:any) =>
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }
                locale={{ emptyText: "Ma'lumot topilmadi" }}
              />
              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                onChange={(newPage, newPageSize) => {
                  setPage(newPage);
                  setLimit(newPageSize);
                  fetchData();
                }}
                showSizeChanger
                pageSizeOptions={["5", "10", "20", "50"]}
                showQuickJumper
                showTotal={(total) => `Jami: ${total} ta yozuv`}
                style={{ textAlign: "right" }}
              />
            </>
          ) : (
            !loading && !error && (
              <Alert
                message="Ma'lumot yo'q"
                description="So'rovni amalga oshirish uchun yuqoridagi maydonlarni to'ldiring."
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
