import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


export default function Profile() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();



  const handleLogout = () => {

    logout();

    navigate("/login");

  };




  return (

    <div className="profile-container">


      <div className="profile-card">


        <div className="profile-header">


          <div className="avatar">

            {
              user?.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : "U"
            }

          </div>



          <h1>
            {user?.full_name}
          </h1>


          <span className="role-badge">

            {user?.role}

          </span>


        </div>






        <div className="profile-details">


          <div className="detail-box">

            <h4>
              👤 Full Name
            </h4>

            <p>
              {user?.full_name}
            </p>

          </div>





          <div className="detail-box">

            <h4>
              📧 Email
            </h4>

            <p>
              {user?.email}
            </p>

          </div>





          <div className="detail-box">

            <h4>
              🔐 Account Type
            </h4>

            <p>
              {user?.role}
            </p>

          </div>



        </div>






        <div className="profile-actions">


          <button
            className="edit-btn"
            onClick={()=>navigate("/profile/edit")}
          >

            ✏️ Edit Profile

          </button>





          <button
            className="home-btn"
            onClick={()=>navigate("/home")}
          >

            🏠 Home

          </button>





          <button
            className="logout-profile-btn"
            onClick={handleLogout}
          >

            🚪 Logout

          </button>



        </div>




      </div>


    </div>

  );

}