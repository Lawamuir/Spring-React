const UaAboutAuthors = () => {
    return (
        <div className="mainContent">
            <div className="additionInfo">
                <h2>Команда task</h2>
                <article>
                    Загалом наша команда складається з 3 людей: Данів Максим, Козьменчук Андрій та Кузишин Дмитро
                </article>
                <ul>
                    <li>Данів Максим: frontEnd-developer</li>
                    <li>Козьменчук Андрій: fullStack-developer</li>
                    <li>Кузишин Дмитро: java-developer</li>
                </ul>

                <article>
                    Ми створили цей проект у межах командного проекту з практикуму програмування з метою зробити зручний застосунок для
                    обробри BMP зображень, приховування повідомлень. Тут було використано бітові карти для обробки зображень та стенографію.
                </article>

                <p>Використані технології:</p>
                <ul>
                    <li>
                        - Frontend: React, TypeScript
                    </li>
                    <li>
                        - Backend: Spring Boot, Java
                    </li>
                    <li>
                        - Інші: Axios, MySQL
                    </li>
                </ul>


            </div>
        </div>
    )
}

export default UaAboutAuthors;