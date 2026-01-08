# Phase 0: Chuẩn bị DB tại Client App (Project 2)

## Mục tiêu
Client App của bạn (Rails, Go, Python...) cần có sẵn các hàm để query dữ liệu.

**Thực hiện tại:** Project 2 (Client Application).

## Logic Yêu Cầu
Bạn cần viết các hàm (Function/Service) có khả năng nhận tham số đầu vào và trả về dữ liệu thô (Array/Object).

## Ví dụ Implementation

Dưới đây là ví dụ logic. Hãy implement tương tự bằng ngôn ngữ của bạn.

### Node.js (Reference)

```typescript
// project2/src/services/product.service.ts
import { db } from '../config/db';

export async function queryProductLocal(category: string, maxPrice?: number) {
  // Logic: Chạy SQL query trực tiếp vào DB của Project 2
  const query = `SELECT * FROM products WHERE category = $1`;
  const result = await db.query(query, [category]);
  return result.rows; 
}
```

### Ruby on Rails (Reference)

```ruby
# project2/app/services/product_service.rb
class ProductService
  def self.query_local_db(category, max_price = nil)
    # Logic: Dùng ActiveRecord
    products = Product.where(category: category)
    products = products.where('price <= ?', max_price) if max_price
    products.as_json(only: [:name, :price, :stock])
  end
end
```

### Golang (Reference)

```go
// project2/internal/service/product.go
func (s *Service) QueryProducts(category string, maxPrice float64) ([]Product, error) {
    // Logic: Dùng GORM hoặc sqlx
    var products []Product
    err := db.Where("category = ? AND price <= ?", category, maxPrice).Find(&products).Error
    return products, err
}
```

## Checkpoint
Đảm bảo function của bạn chạy tốt khi gọi trực tiếp từ code (Unit Test), trước khi tích hợp vào AI.
