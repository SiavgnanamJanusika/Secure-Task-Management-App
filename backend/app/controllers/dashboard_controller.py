from app.database import (
    users_collection,
    tasks_collection
)



async def get_dashboard_data(user: dict):

    user_id = user["id"]
    role = user["role"]


    # Admin dashboard
    if role == "admin":

        tasks = await tasks_collection.find().to_list(length=None)

        users_count = await users_collection.count_documents({})


    # User dashboard
    else:

        tasks = await tasks_collection.find(
            {
                "assigned_to": user_id
            }
        ).to_list(length=None)

        users_count = 0



    total_tasks = len(tasks)


    completed = len(
        [
            task
            for task in tasks
            if task.get("status") == "done"
        ]
    )


    in_progress = len(
        [
            task
            for task in tasks
            if task.get("status") == "in_progress"
        ]
    )


    todo = len(
        [
            task
            for task in tasks
            if task.get("status") == "todo"
        ]
    )


    recent_tasks = []


    for task in tasks[-5:]:

        recent_tasks.append(
            {
                "id": str(task["_id"]),
                "title": task.get("title"),
                "description": task.get("description"),
                "status": task.get("status")
            }
        )


    return {

        "stats": {

            "totalTasks": total_tasks,

            "completed": completed,

            "inProgress": in_progress,

            "todo": todo,

            "users": users_count

        },


        "recentTasks": recent_tasks

    }