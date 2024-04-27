import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export const UserIcon = ({ avatarUrl }) => (
    <div style={iconStyle}>
        <img src={avatarUrl} alt="User Icon" style={imgStyle} />
    </div>
);

const iconStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #00A76F',
    overflow: 'hidden'
};

const imgStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    pointerEvents: 'none'
};

// ----------------------------------------------------------------------

UserIcon.propTypes = {
    avatarUrl: PropTypes.string,
};