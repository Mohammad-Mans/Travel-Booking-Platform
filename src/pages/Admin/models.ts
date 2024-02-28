interface ActionDrawer {
  state: boolean;
  action: string;
}

interface CitiesQuery {
  cityName: string;
  cityDescription: string;
  pageNumber: number;
  pageSize: number;
}

interface City {
  id: number;
  name: string;
  description: string;
}

interface CitySubmitProps {
  id: number;
  name: string;
  description: string;
}

interface HotelsQuery {
  hotelName: string;
  hotelDescription: string;
  pageNumber: number;
  pageSize: number;
}

interface Hotel {
  id: number;
  name: string;
  description: string;
  hotelType: number;
  starRating: number;
  latitude: number;
  longitude: number;
}

interface HotelSubmitProps {
  cityId?: string;
  id: number;
  name: string;
  description: string;
  hotelType: number;
  starRating: number;
  latitude: number;
  longitude: number;
}

interface RoomsQuery {
    roomNumber: string;
    roomCost: string;
    pageNumber: number;
    pageSize: number;
}

interface Room {
    id: number;
    roomNumber: string;
    cost: string;
}

interface RoomSubmitProps {
    hotelId?: string;
    id: number;
    roomNumber: string;
    cost: string;
}
