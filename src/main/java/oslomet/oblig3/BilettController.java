package oslomet.oblig3;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class BilettController {

    @Autowired
    private BilettRepository rep;

    @PostMapping("leggtil")
    public void leggTilBiletter(String film, int antall, String fornavn, String etternavn, String telefon, String epost) {
        Bilett innBilett = new Bilett(film, antall, fornavn, etternavn, telefon, epost);
        rep.lagreBilett(innBilett);
    }

    @PostMapping("rediger")
    public void redigerBiletter(long id, String film, int antall, String fornavn, String etternavn, String telefon, String epost) {
        Bilett innBilett = new Bilett(id, film, antall, fornavn, etternavn, telefon, epost);
        rep.redigerBilett(innBilett);
    }

    @DeleteMapping("slettalt")
    public void slettBiletter() {
        rep.slettAlleBiletter();
    }

    @DeleteMapping("slettenkel")
    public void slettEnkelBilett(long id) {
        rep.slettEnkelBilett(id);
    }

    @GetMapping("hent")
    public List<Bilett> hentBiletter() {
        return rep.hentAlleBiletter();
    }
}

