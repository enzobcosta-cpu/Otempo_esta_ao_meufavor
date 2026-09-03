/* =====================================================
   - FUNÇÃO PRINCIPAL
   Busca a cidade
   ===================================================== */

async function buscarClima() {

    // Pega o nome da cidade digitada no campo
    const cidade = document.getElementById("cidade").value.trim();

    // Pega o elemento onde vamos mostrar o resultado
    const mensagem = document.getElementById("mensagem");

    // Verifica se o usuário não digitou nada
    if (cidade === "") {
        mensagem.innerText = "Digite uma cidade para consultar.";
        return;
    }

    try {

        /* =================================================
        
           A API de geocodificação recebe o nome da cidade
           e retorna latitude, longitude, país etc.
           ================================================= */

        const respostaLocal = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`
        );

        const dadosLocal = await respostaLocal.json();

        // Verifica se a cidade foi encontrada
        if (!dadosLocal.results || dadosLocal.results.length === 0) {
            mensagem.innerText = "Cidade não encontrada.";
            return;
        }

        // Pega os dados da primeira cidade encontrada
        const local = dadosLocal.results[0];

        const latitude = local.latitude;
        const longitude = local.longitude;
        const nomeCidade = local.name;
        const pais = local.country;


        /* =================================================
            BUSCA O CLIMA

           Usa latitude e longitude para pedir os dados do clima.
           ================================================= */

        const respostaClima = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        );

        const dadosClima = await respostaClima.json();

        // Pega os dados atuais
        const clima = dadosClima.current;


        /* =================================================
           CONVERTE O CÓDIGO DO TEMPO

           A API retorna um número para representar o clima.
           ================================================= */

        const descricao = interpretarClima(clima.weather_code);


        /* =================================================
          - MOSTRA O RESULTADO NA TELA
           ================================================= */

        mensagem.innerHTML = `
            <strong>${nomeCidade}, ${pais}</strong><br><br>

            🌡️ Temperatura: ${clima.temperature_2m} °C<br>

            🌡️ Sensação: ${clima.apparent_temperature} °C<br>

            💧 Umidade: ${clima.relative_humidity_2m}%<br>

            💨 Vento: ${clima.wind_speed_10m} km/h<br>

            ☁️ Condição: ${descricao}
        `;

    } catch (erro) {

        // Caso aconteça algum problema na conexão
        mensagem.innerText =
            "Não foi possível consultar o clima. Tente novamente.";

        console.error(erro);
    }
}


function interpretarClima(codigo) {

    if (codigo === 0) {
        return "Céu limpo ☀️";
    }

    if (codigo === 1 || codigo === 2) {
        return "Parcialmente nublado 🌤️";
    }

    if (codigo === 3) {
        return "Nublado ☁️";
    }

    if (codigo >= 45 && codigo <= 48) {
        return "Neblina 🌫️";
    }

    if (codigo >= 51 && codigo <= 67) {
        return "Chuva 🌧️";
    }

    if (codigo >= 71 && codigo <= 77) {
        return "Neve ❄️";
    }

    if (codigo >= 80 && codigo <= 82) {
        return "Pancadas de chuva 🌦️";
    }

    if (codigo >= 95) {
        return "Tempestade ⛈️";
    }

    return "Condição desconhecida";
}