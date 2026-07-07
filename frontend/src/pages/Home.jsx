import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "../api/taskApi.js";
import { useAuth } from "../context/AuthContext.jsx";


export default function Home() {

  const { user } = useAuth();

  const navigate = useNavigate();


  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    users: 0
  });


  const [recentTasks, setRecentTasks] = useState([]);



  useEffect(() => {

    loadDashboard();

  }, []);



  const loadDashboard = async () => {

    try {

      const response = await getDashboardData();

      setStats(response.stats);

      setRecentTasks(response.recentTasks);


    } catch(error) {

      console.log(
        "Dashboard loading error",
        error
      );

    }

  };




  return (

    <div className="home-container">


      {/* Welcome Section */}

      <div className="welcome-card">

        <h1>
          🏠 Welcome {user?.full_name}
        </h1>

        <p>
          Manage your tasks efficiently and track your progress.
        </p>

      </div>





      {/* Statistics Cards */}

      <div className="stats-grid">


        <div className="stat-card">

          <h3>
            📊 Total Tasks
          </h3>

          <h1>
            {stats.totalTasks}
          </h1>

        </div>




        <div className="stat-card">

          <h3>
            ✅ Completed
          </h3>

          <h1>
            {stats.completed}
          </h1>

        </div>





        <div className="stat-card">

          <h3>
            🔄 In Progress
          </h3>

          <h1>
            {stats.inProgress}
          </h1>

        </div>





        <div className="stat-card">

          <h3>
            📋 To Do
          </h3>

          <h1>
            {stats.todo}
          </h1>

        </div>





        {
          user?.role === "admin" && (

            <div className="stat-card">

              <h3>
                👥 Total Users
              </h3>

              <h1>
                {stats.users}
              </h1>

            </div>

          )
        }



      </div>







      {/* Recent Tasks */}


      <div className="recent-section">


        <h2>
          ⚡ Recent Tasks
        </h2>



        {
          recentTasks.length === 0 ? (

            <p>
              No recent tasks found
            </p>


          ) : (


            recentTasks.map((task)=>(


              <div
                className="recent-task"
                key={task.id}
              >


                <div>

                  <h4>
                    {task.title}
                  </h4>


                  <p>
                    {task.description}
                  </p>

                </div>




                <span
                  className={
                    `status ${task.status}`
                  }
                >

                  {task.status}

                </span>


              </div>


            ))


          )

        }



      </div>






      {/* Profile Shortcut */}


      <button
        className="profile-shortcut"
        onClick={()=>navigate("/profile")}
      >

        👤 View Profile

      </button>




    </div>

  );

}