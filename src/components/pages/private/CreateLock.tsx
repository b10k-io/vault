import LockForm from "../../form/LockForm"

function CreateLock() {
    return (
        <>
            <h1 className="text-xl font-semibold uppercase text-center mb-8">Create Lock</h1>
            <div className="border p-8 bg-white/10 mt-8 mx-64">
                <LockForm />
            </div>
        </>
    )
}

export default CreateLock