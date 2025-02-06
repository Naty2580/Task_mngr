import React from "react";
import { Link,Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        backgroundColor: "#f5f5f5",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2025 Natnael Tesfaye. All rights reserved.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        email: <Link href="mailto:natyyo2580@gmail.com">natyyo2580@gmail.com </Link>
        <br/>
        phone: +251900827698
      </Typography>
    </Box>
  );
};

export default Footer;
