import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name
const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 800 800" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
        <style type="text/css">
          {`.st0{fill:url(#SVGID_1_);}
            .st1{fill:url(#SVGID_2_);}
            .st2{fill:url(#SVGID_3_);}
            .st3{fill:url(#SVGID_4_);}
            .st4{fill:url(#SVGID_5_);}
            .st5{fill:url(#SVGID_6_);}
            .st6{fill:url(#SVGID_7_);}
            .st7{fill:#00A76F;}
            .st8{fill:url(#SVGID_8_);}
            .st9{fill:url(#SVGID_9_);}
            .st10{fill:url(#SVGID_10_);}
            .st11{fill:url(#SVGID_11_);}
            .st12{fill:url(#SVGID_12_);}
            .st13{fill:url(#SVGID_13_);}
            .st14{fill:url(#SVGID_14_);}`}
        </style>
        <g>
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="471.9129" y1="116.065" x2="471.9129" y2="486.8808">
            <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
            <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
          </linearGradient>

          <path className="st0" d="M417.1,112h-11.3c-94.2,0-84.8,127.1-84.8,127.1h79.1c43.5,0,78.9,35.3,78.9,78.9v0
		c0,43.5-35.3,78.9-78.9,78.9h-63.5v127.1h80.5c113.7,0,205.9-92.2,205.9-205.9v0C623,204.2,530.8,112,417.1,112z"/>
          <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="336.5946" y1="317.92" x2="464.076" y2="317.92">
            <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
            <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
          </linearGradient>
          <circle className="st1" cx="400.3" cy="317.9" r="63.7" />
          <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="176.9619" y1="616.087" x2="320.7878" y2="616.087">
            <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
            <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
          </linearGradient>
          <circle className="st2" cx="248.9" cy="616.1" r="71.9" />
          <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="176.9619" y1="616.087" x2="320.7878" y2="616.087">
            <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
            <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
          </linearGradient>
          <circle className="st3" cx="248.9" cy="616.1" r="71.9" />
          <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="176.9619" y1="616.087" x2="320.7878" y2="616.087">
            <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
            <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
          </linearGradient>
          <circle className="st4" cx="248.9" cy="616.1" r="71.9" />
          <linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="176.9619" y1="616.087" x2="320.7878" y2="616.087">
            <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
            <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
          </linearGradient>
          <circle className="st5" cx="248.9" cy="616.1" r="71.9" />
          <g>
            <linearGradient id="SVGID_7_" gradientUnits="userSpaceOnUse" x1="291.382" y1="563.8324" x2="291.382" y2="116.0625">
              <stop offset="3.299198e-07" style={{ stopColor: "#00A76F" }} />
              <stop offset="1" style={{ stopColor: "#62DDB1" }}  />
            </linearGradient>
            <path className="st6" d="M232.8,112c-30.8,0-55.8,25-55.8,55.8v390.5c16.9-21,42.8-34.5,71.9-34.5c29.3,0,55.3,13.7,72.2,34.9V239.1
			c0,0-9.4-127.1,84.8-127.1H232.8z"/>
          </g>
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
