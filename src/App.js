import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  Pagination,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CSVLink } from "react-csv";

const CLIENT_ID =
  "171649086529-6ffeis8ns1gne7h4k8ua5jlcauqfh5jm.apps.googleusercontent.com";

function App() {
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    const initGapiClient = async () => {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            clientId: CLIENT_ID,
            scope:
              "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events.public.readonly",
          });
          await gapi.client.load("calendar", "v3");
          setIsGapiInitialized(true);
        } catch (error) {
          console.error("Error initializing GAPI client:", error);
        }
      });
    };
    initGapiClient();
  }, []);

  const authenticate = async () => {
    if (!isGapiInitialized) return;

    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      const userInfo = await gapi.client.request({
        path: "https://www.googleapis.com/oauth2/v2/userinfo",
      });
      const email = userInfo.result.email;
      setUserEmail(email);
      setIsLoggedIn(true);
      const userEvents = await fetchUserCalendarEvents(email);
      setEvents(userEvents);
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const fetchUserCalendarEvents = async (email) => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: email,
        maxResults: 100,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.result.items || [];
      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.start.dateTime || a.start.date);
        const dateB = new Date(b.start.dateTime || b.start.date);
        return dateB - dateA;
      });

      return sortedEvents;
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return [];
    }
  };

  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        return (
          eventDate.toDateString() === new Date(selectedDate).toDateString()
        );
      })
    : events;

  const filteredEventsByName = events.filter((event) =>
    event.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEventsByName.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ backgroundColor: "#f1f3f4", minHeight: "100vh" }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Google Calendar Integration
            </Typography>
            {isLoggedIn && (
              <>
                <Typography variant="body1" sx={{ marginRight: "20px" }}>
                  {userEmail}
                </Typography>
                <Avatar sx={{ bgcolor: "#1a73e8" }}>
                  {userEmail.charAt(0)}
                </Avatar>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container sx={{ padding: "20px" }}>
          {!isLoggedIn ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1a73e8", color: "white", marginTop: "20px" }}
              onClick={authenticate}
            >
              Sign In with Google
            </Button>
          ) : (
            <>
              <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                Calendar Events
              </Typography>
              <DatePicker
                label="Filter by Date"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                label="Search Events"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: "20px" }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="contained"
                color="blue"
                sx={{ margin: "20px" }}
              >
                <CSVLink
                  data={events.map((event) => ({
                    Name: event.summary || "No Title",
                    Date: new Date(
                      event.start.dateTime || event.start.date
                    ).toLocaleDateString(),
                    Time: event.start.dateTime
                      ? new Date(event.start.dateTime).toLocaleTimeString()
                      : "All Day",
                    Location: event.location || "N/A",
                  }))}
                  filename="events.csv"
                >
                  Export to CSV
                </CSVLink>
              </Button>
              {filteredEvents.length > 0 ? (
                <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentEvents.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>{event.summary || "No Title"}</TableCell>
                          <TableCell>
                            {new Date(
                              event.start.dateTime || event.start.date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {event.start.dateTime
                              ? new Date(event.start.dateTime).toLocaleTimeString()
                              : "All Day"}
                          </TableCell>
                          <TableCell>{event.location || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{ marginTop: "20px" }}>
                  No events found for the selected date.
                </Typography>
              )}
              <Box sx={{ marginTop: "20px" }}>
                <Pagination
                  count={Math.ceil(filteredEventsByName.length / eventsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Container>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
