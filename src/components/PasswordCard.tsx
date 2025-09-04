import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Password } from "@/types/types"

interface DetailsCardProps {
  data: Password
}

export default function PasswordCard({ data }: DetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.service_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>URL:</strong> {data.url}</p>
        <p><strong>Email:</strong> {data.email}</p>
       
        <p className="text-sm text-gray-500">
          Last Updated: {new Date(data.last_updated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
