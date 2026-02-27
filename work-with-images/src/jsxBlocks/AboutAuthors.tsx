const AboutAuthors = () => {
    return (
        <div className="mainContent">
            <div className="additionInfo">
                <h2>Team task</h2>
                <article>
                    Overall, our team consists of 3 people: Daniv Maxim, Kozmenchuk Andriy and Kyzyshyn Dmytro
                </article>
                <ul>
                    <li>Daniv Maxim: frontEnd-developer</li>
                    <li>Kozmenchuk Andriy: fullStack-developer</li>
                    <li>Kyzyshyn Dmytro: java-developer</li>
                </ul>

                <article>
                    We created this project as part of a team assignment in a programming practicum,
                    aiming to develop a convenient application for processing BMP images and hiding messages.
                    Bitmaps were used for image processing, along with steganography techniques.
                </article>

                <p>Used technologies:</p>
                <ul>
                    <li>
                        - Frontend: React, TypeScript
                    </li>
                    <li>
                        - Backend: Spring Boot, Java
                    </li>
                    <li>
                        - Other: Axios, MySQL
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AboutAuthors;