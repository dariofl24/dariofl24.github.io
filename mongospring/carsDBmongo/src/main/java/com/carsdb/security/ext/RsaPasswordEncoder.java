package com.carsdb.security.ext;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.spec.PKCS8EncodedKeySpec;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;

import com.carsdb.exception.PasswordEncodingException;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.crypto.password.PasswordEncoder;

public class RsaPasswordEncoder implements InitializingBean, PasswordEncoder
{
    private final static String PK_PATH = "pwdkeys/test/privateKey";

    private final static String _SALT = "my-%s-super-cars-1234";

    private Cipher cipher;

    @Override
    public void afterPropertiesSet() throws Exception
    {
        final File file = new File(getClass().getClassLoader().getResource(PK_PATH).getFile());
        final PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(Files.readAllBytes(Paths.get(file.getPath())));

        this.cipher = Cipher.getInstance("RSA");
        this.cipher.init(Cipher.ENCRYPT_MODE, KeyFactory.getInstance("RSA").generatePrivate(spec));
    }

    @Override
    public String encode(final CharSequence charSequence)
    {
        try
        {
            final String base64String = Base64.encodeBase64String(cipher.doFinal(
                    String.format(_SALT, charSequence.toString()).getBytes("UTF-8")));

            return base64String;
        }
        catch (IllegalBlockSizeException | BadPaddingException | UnsupportedEncodingException ex)
        {
            throw new PasswordEncodingException("There was an error while encoding the password.", ex);
        }
    }

    @Override
    public boolean matches(final CharSequence rawPassword, final String encodedPassword)
    {
        return encode(rawPassword).equals(encodedPassword);
    }
}
