import { PreActivitieItem } from './PreActivityItem';
export default function PreActivities({ preActivities }) {
    return (
        <div className="w-fit">
            {
                preActivities.length === 0 ? (
                    <p>
                        No hay actividades relacionadas
                    </p>
                ):(
                    preActivities.map(pre =>(<PreActivitieItem
                        key={pre.assignmentId}
                        pre={pre}
                    />))
                )
            }


        </div>
    );
}
